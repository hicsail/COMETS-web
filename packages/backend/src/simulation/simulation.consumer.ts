import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/email/email.service';
import { JobService, JobStatus } from '../job/job.service';
import { SimulationRequest } from './models/request.model';

@Processor('simulationRequest')
export class SimulationRequestConsumer extends WorkerHost {
  constructor(private readonly jobService: JobService, private readonly emailService: EmailService) {
    super();
  }

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

  private async handleError(request: SimulationRequest, jobName: string): Promise<void> {
    // Get the pod logs
    const logs = await this.jobService.getPodLogs(jobName);

    // Send the failure email
    await this.emailService.sendFailure(request.email, logs, request);

    // Delete the failed job
    await this.jobService.deleteJob(jobName);
  }

  private async handleSuccess(_request: SimulationRequest, jobName: string): Promise<void> {
    // Simply delete the job service, the completion consumer handles jobs that
    // gracefully completed
    await this.jobService.deleteJob(jobName);
  }

  /**
   * Keep checking the status of the job once a second
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
