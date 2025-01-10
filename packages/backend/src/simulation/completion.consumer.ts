import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SimulationResult } from './models/result.model';
import { Job } from 'bullmq';
import { SimulationService } from './simulation.service';
import { EmailService } from '../email/email.service';

/**
 * BullMQ processor which handles completion notifications from the COMETS-Runner.
 * Stores the results and sends the success message to the user.
 */
@Processor('completion')
export class SimulationCompletionProcessor extends WorkerHost {
  constructor(private readonly simulationService: SimulationService, private readonly emailService: EmailService) {
    super();
  }

  /**
   * Handles processing completion messages. Sends the results to the database for storage then
   * sends the success email to the user.
   *
   * @param job The queue element containing the simulation results
   */
  async process(job: Job<SimulationResult, any, string>): Promise<any> {
    const result = job.data;
    const request = await this.simulationService.makeComplete(result.requestID, result);
    if (!request) {
      throw new Error(`Request with id ${result.requestID} not found`);
    }
    await this.emailService.sendSuccess(request.email, request._id);
  }
}
