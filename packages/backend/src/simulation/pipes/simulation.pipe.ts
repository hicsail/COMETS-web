import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SimulationRequest } from '../models/request.model';
import { SimulationService } from '../simulation.service';

@Injectable()
export class SimulationPipe implements PipeTransform<string, Promise<SimulationRequest>> {
  constructor(private readonly simulationService: SimulationService) {}

  async transform(value: string): Promise<SimulationRequest> {
    const result = await this.simulationService.get(value);
    if (!result) {
      throw new BadRequestException(`Simulation Request with ID ${value} does not exist`);
    }
    return result;
  }
}
