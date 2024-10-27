import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SimulationResult } from './models/result.model';
import { Job } from 'bullmq';
import { SimulationService  } from './simulation.service';

@Processor('completion')
export class SimulationCompletionProcessor extends WorkerHost {

  constructor(private readonly simulationService: SimulationService) {
    super();
  }

  async process(job: Job<SimulationResult, any, string>): Promise<any> {
    const result = job.data;
    await this.simulationService.makeComplete(result.requestID, result);
  }
}
