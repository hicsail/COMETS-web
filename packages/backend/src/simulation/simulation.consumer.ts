import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobService } from 'src/job/job.service';
import { SimulationRequest, SimulationStatus } from './models/request.model';
import { SimulationService } from './simulation.service';

@Processor('simulationRequest')
export class SimulationRequestConsumer extends WorkerHost {
  constructor(
    private readonly jobService: JobService,
    private readonly simulationService: SimulationService
  ) {
    super();
  }

  async process(job: Job<SimulationRequest, any, string>): Promise<any> {
    const request = job.data;
    await this.jobService.triggerJob(request);
    await this.awaitCompletion(request._id);
    console.log('Job complete');
  }

  async awaitCompletion(requestID: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const checkOperations = async () => {
        // Get the simulation
        const request = await this.simulationService.get(requestID);
        if (request == null) {
          reject(`Simulation request wit ID ${requestID} not found`);
          return;
        }

        // Simulation still running check in a second
        if (request.status == SimulationStatus.IN_PROGRESS) {
          setTimeout(checkOperations, 1000);
          return;
        } else {
          // Simulation complete
          resolve();
        }
      }

      // Start the check operation
      await checkOperations();
    });
  }
}
