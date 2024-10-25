import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobService } from 'src/job/job.service';
import { SimulationRequest } from './models/request.model';

@Processor('simulationRequest')
export class SimulationRequestConsumer extends WorkerHost {
  constructor(private readonly jobService: JobService) {
    super();
  }

  async process(job: Job<SimulationRequest, any, string>): Promise<any> {
    const request = job.data;
    // await this.jobService.triggerJob(request);
  }
}
