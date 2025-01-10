import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/email/email.service';
import { JobService, JobStatus } from '../job/job.service';
import { SimulationRequest } from './models/request.model';

/**
 * BullMQ processor which handles triggering COMETS-Runner and listening for pod success/failure.
 * Acts as a manager to have jobs queued and executed one-by-one.
 */
@Processor('simulationRequest')
export class SimulationRequestConsumer extends WorkerHost {
  constructor(private readonly jobService: JobService, private readonly emailService: EmailService) {
    super();
  }

  /**
   * Handles simulation requeust messages. Leverages the JobService to actually run the job then
   * waits for the pod to complete. If the pod is in an error state, then a failure message is
   * sent to the user and mainter (different messages). In either case, the pod is then deleted.
   *
   * @param job The queue element containing the simulation request
   */
  async process(job: Job<SimulationRequest, any, string>): Promise<any> {
    const request = job.data;
    // Start the COMETs job
    const jobName = await this.jobService.triggerJob(request);
    // Wait for the job to complete
    const status = await this.awaitCompletion(jobName);
    // If the status is error, collect and send error data
    if (status == JobStatus.FAILURE) {
      await this.handleError(request, jobName);
    } else {
      await this.handleSuccess(request, jobName);
    }
  }

  /**
   * Handles when the pod was found to be in an error state. The logs are taken from the pod,
   * the failure messages are sent out, then the pod is deleted.
   *
   * @param request The request of the failed job
   * @param jobName The Kubernetes job name
   */
  private async handleError(request: SimulationRequest, jobName: string): Promise<void> {
    // Get the pod logs
    const logs = await this.jobService.getPodLogs(jobName);

    // Send the failure email
    await this.emailService.sendFailure(request.email, logs, request);

    // Delete the failed job
    await this.jobService.deleteJob(jobName);
  }

  /**
   * Handles when the pod was found to have finished successfully. The pod is simply deleted
   *
   * @param _request The request of the successful job
   * @param jobName The Kubernetes job name
   */
  private async handleSuccess(_request: SimulationRequest, jobName: string): Promise<void> {
    // Simply delete the job service, the completion consumer handles jobs that
    // gracefully completed
    await this.jobService.deleteJob(jobName);
  }

  /**
   * Keep checking the status of the job once a second. Leverages the JobService to get the status
   * of the Job.
   *
   * @param jobName The Kubernetes job name
   */
  private async awaitCompletion(jobName: string): Promise<JobStatus> {
    return new Promise(async (resolve, reject) => {
      const checkOperations = async () => {
        try {
          const status = await this.jobService.getJobStatus(jobName);
          if (status == JobStatus.RUNNING) {
            setTimeout(checkOperations, 1000);
            return;
          } else {
            resolve(status);
          }
        } catch (e) {
          reject(e);
        }
      };
      await checkOperations();
    });
  }
}
