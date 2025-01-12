import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SimulationRequest } from '../models/request.model';
import { SimulationService } from '../simulation.service';

/** Pipe to convert a simulation ID into a full simulation object. */
@Injectable()
export class SimulationPipe implements PipeTransform<string, Promise<SimulationRequest>> {
  constructor(private readonly simulationService: SimulationService) {}

  /**
   * Convert an ID into an object, throw a BadRequestException if the ID is not valid
   */
  async transform(value: string): Promise<SimulationRequest> {
    const result = await this.simulationService.get(value);
    if (!result) {
      throw new BadRequestException(`Simulation Request with ID ${value} does not exist`);
    }
    return result;
  }
}
