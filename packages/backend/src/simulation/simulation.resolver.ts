import { Args, Resolver, Query, Mutation, ID } from '@nestjs/graphql';
import { SimulationRequestInput } from './dtos/request.dto';
import { SimulationRequest } from './models/request.model';
import { SimulationPipe } from './pipes/simulation.pipe';
import { SimulationService } from './simulation.service';

@Resolver(() => SimulationRequest)
export class SimulationResolver {
  constructor(private readonly simulationService: SimulationService) {}

  @Mutation(() => Boolean)
  async requestSimulation(@Args('request') request: SimulationRequestInput): Promise<boolean> {
    await this.simulationService.requestSimulation(request);
    return true;
  }

  @Query(() => String)
  async example(): Promise<string> {
    return 'hello';
  }

  @Query(() => SimulationRequest)
  async getSimulationRequest(@Args('request', { type: () => ID }, SimulationPipe) request: SimulationRequest): Promise<SimulationRequest> {
    return request;
  }
}
