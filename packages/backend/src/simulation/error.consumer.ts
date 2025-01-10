import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SimulationService } from './simulation.service';
import { EmailService } from '../email/email.service';
import { SimulationError } from './dtos/error.dto';

@Processor('error')
export class SimulationErrorProcessor extends WorkerHost {
  constructor(private readonly simulationService: SimulationService, private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<SimulationError, any, string>): Promise<any> {
    const response = job.data;
    const request = await this.simulationService.markFailure(response.requestID);
    if (!request) {
      throw new Error(`Request with id ${response.requestID} not found`);
    }
    await this.emailService.sendFailure(request.email, response.error, request);
  }
}
