import {
  KubeConfig,
  V1Job,
  V1ObjectMeta,
  V1JobSpec,
  V1PodTemplateSpec,
  V1PodSpec,
  BatchV1Api,
  V1LocalObjectReference
} from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SimulationRequest } from '../simulation/models/request.model';
import { InjectKube } from './kubectl.provider';
import { uuid } from 'uuidv4';

@Injectable()
export class JobService {
  private readonly jobTemplate = new V1Job();
  private readonly batchClient = this.kubeConfig.makeApiClient(BatchV1Api);
  private readonly namespace = this.configService.getOrThrow<string>('runner.namespace');
  private readonly bucket = this.configService.getOrThrow<string>('s3.bucket');

  constructor(@InjectKube() private readonly kubeConfig: KubeConfig, private readonly configService: ConfigService) {
    // Fill in template for a job
    const metadata = new V1ObjectMeta();
    metadata.name = 'comets-runner';
    this.jobTemplate.metadata = metadata;
    this.jobTemplate.apiVersion = 'batch/v1';
    this.jobTemplate.kind = 'Job';
    this.jobTemplate.spec = new V1JobSpec();
    this.jobTemplate.spec.ttlSecondsAfterFinished = 30;
    this.jobTemplate.spec.template = new V1PodTemplateSpec();
    this.jobTemplate.spec.template.spec = new V1PodSpec();
    this.jobTemplate.spec.template.spec.containers = [];
    this.jobTemplate.spec.template.spec.containers.push({
      name: 'comets-runner',
      image: configService.getOrThrow<string>('runner.image'),
      // NOTE: The command will be modified with the specific parameters later
      command: [],
      env: [
        { name: 'S3_ACCESS_KEY_ID', value: this.configService.getOrThrow<string>('s3.accessID') },
        { name: 'S3_SECRET_ACCESS_KEY', value: this.configService.getOrThrow<string>('s3.accessSecret') },
        { name: 'S3_ENDPOINT_URL', value: this.configService.getOrThrow<string>('s3.endpoint') },
        { name: 'COMETS_GLOP', value: './lib/comets_glop' }
      ]
    });
    this.jobTemplate.spec.template.spec.restartPolicy = 'Never';
    this.jobTemplate.spec.template.spec.imagePullSecrets = [new V1LocalObjectReference()];
    this.jobTemplate.spec.template.spec.imagePullSecrets![0].name = this.configService.getOrThrow<string>('runner.imagePullSecret')
  }

  async triggerJob(simulationRequest: SimulationRequest): Promise<string> {
    const job: V1Job = JSON.parse(JSON.stringify(this.jobTemplate));
    const jobName = `comets-runner-${uuid()}`;
    job.metadata!.name = `comets-runner-${uuid()}`
    job.spec!.template.spec!.containers[0].command = this.createCommand(simulationRequest);

    await this.batchClient.createNamespacedJob(this.namespace, job);
    return jobName;
  }

  private createCommand(simulationRequest: SimulationRequest): string[] {
    let modelParams: string[] = [];

    for (const param of simulationRequest.modelParams) {
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
      `--s3-folder=${uuid()}`,
      `--s3-save=True`,
      `--metabolite-type=${simulationRequest.metaboliteParams.type}`,
      `--metabolite-amount=${simulationRequest.metaboliteParams.amount}`,
      `--layout-type=test_tube`,
      ...modelParams,
      `--time-step=${simulationRequest.globalParams.timeStep}`,
      `--log-freq=${simulationRequest.globalParams.logFreq}`,
      `--default-diff-const=${simulationRequest.globalParams.defaultDiffConst}`,
      `--default-v-max=${simulationRequest.globalParams.defaultVMax}`,
      `--default-km=${simulationRequest.globalParams.defaultKm}`,
      `--max-cycles=${simulationRequest.globalParams.maxCycles}`
    ]
  }
}
