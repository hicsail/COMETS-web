import {
  KubeConfig,
  V1Job,
  V1ObjectMeta,
  V1JobSpec,
  V1PodTemplateSpec,
  V1PodSpec,
  BatchV1Api,
  V1LocalObjectReference,
  CoreV1Api
} from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectKube } from './kubectl.provider';
import { CometsParameters } from './comets-paramters.dto';
import { SimulationRequest } from 'src/simulation/models/request.model';
import { RequestConverter } from './converter.service';

export enum JobStatus {
  SUCCESS,
  RUNNING,
  FAILURE
}

/**
 * Handles management of Kubernetes Job. Provides an interface for launching an instance of
 * the COMETS-Runner and for checking on the status of the pod.
 */
@Injectable()
export class JobService {
  private readonly jobTemplate = new V1Job();
  private readonly batchClient = this.kubeConfig.makeApiClient(BatchV1Api);
  private readonly coreClient = this.kubeConfig.makeApiClient(CoreV1Api);
  private readonly namespace = this.configService.getOrThrow<string>('runner.namespace');
  private readonly bucket = this.configService.getOrThrow<string>('s3.bucket');

  constructor(
    @InjectKube() private readonly kubeConfig: KubeConfig,
    private readonly configService: ConfigService,
    private readonly converterService: RequestConverter
  ) {
    // Fill in template for a job, includes what is needed to define the Kubernetes Job
    const metadata = new V1ObjectMeta();
    metadata.name = 'comets-runner';
    this.jobTemplate.metadata = metadata;
    this.jobTemplate.apiVersion = 'batch/v1';
    this.jobTemplate.kind = 'Job';
    this.jobTemplate.spec = new V1JobSpec();
    // this.jobTemplate.spec.ttlSecondsAfterFinished = 30;
    this.jobTemplate.spec.template = new V1PodTemplateSpec();
    this.jobTemplate.spec.template.spec = new V1PodSpec();

    this.jobTemplate.spec.template.spec.volumes = [];
    this.jobTemplate.spec.template.spec.volumes.push({
      name: 'sim-files',
      emptyDir: {}
    });

    this.jobTemplate.spec.template.spec.containers = [];
    this.jobTemplate.spec.template.spec.containers.push({
      resources: {
        limits: {
          cpu: '1',
          memory: '4Gi'
        }
      },
      name: 'comets-runner',
      image: configService.getOrThrow<string>('runner.image'),
      // NOTE: The command will be modified with the specific parameters later
      command: [],
      env: [
        { name: 'S3_ACCESS_KEY_ID', value: this.configService.getOrThrow<string>('s3.accessID') },
        { name: 'S3_SECRET_ACCESS_KEY', value: this.configService.getOrThrow<string>('s3.accessSecret') },
        { name: 'S3_ENDPOINT_URL', value: this.configService.getOrThrow<string>('s3.endpoint') },
        { name: 'REDIS_HOST', value: this.configService.getOrThrow<string>('redis.jobHost') },
        { name: 'REDIS_PORT', value: this.configService.getOrThrow<string>('redis.jobPort') },
        { name: 'REDIS_PASSWORD', value: this.configService.get<string>('redis.jobPassword') },
        { name: 'COMETS_GLOP', value: './lib/comets_glop' }
      ],
      imagePullPolicy: 'Always',
      volumeMounts: [{ name: 'sim-files', mountPath: '/app/sim_files/' }]
    });
    this.jobTemplate.spec.template.spec.restartPolicy = 'Never';
    this.jobTemplate.spec.backoffLimit = 0;
    this.jobTemplate.spec.template.spec.imagePullSecrets = [new V1LocalObjectReference()];
    this.jobTemplate.spec.template.spec.imagePullSecrets[0].name =
      this.configService.getOrThrow<string>('runner.imagePullSecret');
  }

  /**
   * Logic to start an instance of the COMETS-Runner. Copies the Kubernetes Job template,
   * updates the templates with run specific settings such as the job name and the COMETS
   * parameters. Returns the job name to identify the specific run.
   *
   * @param request The user simulation request
   * @returns The job name
   */
  async triggerJob(request: SimulationRequest): Promise<string> {
    // Turn the request into COMETS parameters
    const parameters = await this.converterService.convert(request);

    // Create a Job configuration based on the paramters
    const job: V1Job = JSON.parse(JSON.stringify(this.jobTemplate));
    const jobName = `comets-runner-${parameters.requestID}`;
    job.metadata!.name = jobName;
    const command = this.createCommand(parameters);
    job.spec!.template.spec!.containers[0].command = command;

    // Start the job
    await this.batchClient.createNamespacedJob(this.namespace, job);
    return jobName;
  }

  /**
   * Logic to get the status of the Kubernetes Job. Leveraged the Kubernetes
   * API to get the status then converts it into a `JobStatus` enum for easier
   * parsing.
   *
   * @param jobName The name of the job to check the status of
   * @retuns The status of the job
   */
  async getJobStatus(jobName: string): Promise<JobStatus> {
    const jobStatus = await this.batchClient.readNamespacedJob(jobName, this.namespace);
    const status = jobStatus.body!.status!;

    if (status.succeeded && status.succeeded > 0) {
      return JobStatus.SUCCESS;
    } else if (status.failed && status.failed > 0) {
      return JobStatus.FAILURE;
    } else if (status.ready && status.ready > 0) {
      return JobStatus.RUNNING;
    } else if (status.active && status.active > 0) {
      return JobStatus.RUNNING;
    } else {
      return JobStatus.RUNNING;
    }
  }

  /**
   * Delete the Kubernetes Job.
   *
   * @param jobName The name of the job to delete
   */
  async deleteJob(jobName: string): Promise<void> {
    await this.batchClient.deleteNamespacedJob(jobName, this.namespace);
  }

  /**
   * Get the logs from the pod associated with the job.
   *
   * @param jobName The job to get the logs from
   * @returns The stdout logs from the job
   */
  async getPodLogs(jobName: string): Promise<string> {
    // Figure out the pod from the job name
    const pods = await this.coreClient.listNamespacedPod(
      this.namespace,
      undefined,
      undefined,
      undefined,
      undefined,
      `batch.kubernetes.io/job-name=${jobName}`
    );
    const podName = pods.body!.items[0].metadata!.name;

    // Get the logs from the target pod
    const logs = await this.coreClient.readNamespacedPodLog(podName!, this.namespace);
    return logs.body;
  }

  /**
   * Creates the command for the COMETS-Runner (see ./packages/runner for more information).
   * Handles both passing the user provided parameters as well as application level information
   * on how to store the results.
   *
   * @params parameters The COMETS-Runner ready parameters
   * @returns The CLI command for COMETS-Runner
   */
  private createCommand(parameters: CometsParameters): string[] {
    let modelParams: string[] = [];

    for (const param of parameters.modelParams) {
      modelParams = modelParams.concat([
        `--model-name=${param.name}`,
        `--model-neutral-drift=${param.neutralDrift}`,
        `--model-neutral-drift-amp=${param.neutralDriftAmp}`,
        `--model-death-rate=${param.deathRate}`,
        `--model-linear-diffusivity=${param.linearDiffusivity}`,
        `--model-nonlinear-diffusivity=${param.nonlinearDiffusivity}`
      ]);
    }

    return [
      'python3',
      'main.py',
      `--s3-bucket=${this.bucket}`,
      `--s3-folder=${parameters.s3Folder}`,
      `--s3-save`,
      `--queue=completion`,
      `--id=${parameters.requestID}`,
      `--notify`,
      `--metabolite-type=${parameters.metaboliteParams.type}`,
      `--metabolite-amount=${parameters.metaboliteParams.amount}`,
      `--layout-type=${parameters.layoutParams.type}`,
      `--space-width=${parameters.layoutParams.spaceWidth}`,
      `--grid-size=${parameters.layoutParams.gridSize}`,
      ...modelParams,
      `--time-step=${parameters.globalParams.timeStep}`,
      `--log-freq=${parameters.globalParams.logFreq}`,
      `--default-diff-const=${parameters.globalParams.defaultDiffConst}`,
      `--default-v-max=${parameters.globalParams.defaultVMax}`,
      `--default-km=${parameters.globalParams.defaultKm}`,
      `--max-cycles=${parameters.globalParams.maxCycles}`
    ];
  }
}
