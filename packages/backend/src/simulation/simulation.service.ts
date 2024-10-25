import { Injectable } from '@nestjs/common';
import { JobService } from '../job/job.service';
import { SimulationRequst } from './dtos/request.dto';

@Injectable()
export class SimulationService {
  constructor(private readonly jobService: JobService) {}

  async requestSimulation(request: SimulationRequst) {
    await this.jobService.triggeJob(request);
  }

}
