import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SimulationResult } from './models/result.model';
import { Job } from 'bullmq';

@Processor('completion')
export class SimulationCompletionProcessor extends WorkerHost {

  async process(job: Job<SimulationResult, any, string>): Promise<any> {
    console.log(job);
  }
}
