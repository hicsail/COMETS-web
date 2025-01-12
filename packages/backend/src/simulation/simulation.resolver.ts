import { Args, Resolver, Query, Mutation, ID } from '@nestjs/graphql';
import { SimulationRequestInput } from './dtos/request.dto';
import { SimulationRequest } from './models/request.model';
import { SimulationPipe } from './pipes/simulation.pipe';
import { SimulationService } from './simulation.service';

/** GraphQL resolver for making simulation requests and getting simulation results */
@Resolver(() => SimulationRequest)
export class SimulationResolver {
  constructor(private readonly simulationService: SimulationService) {}

  /**
   * Entrypoint for making simulation requests. Kicks off the process of running the simulation.
   *
   * @param request The user simulation request for processing
   * @returns True to signify simulation started (required of GraphQL)
   */
  @Mutation(() => Boolean)
  async requestSimulation(@Args('request') request: SimulationRequestInput): Promise<boolean> {
    await this.simulationService.requestSimulation(request);
    return true;
  }

  /**
   * Entrypoint for getting a request by ID. The user is provided an email with the ID.
   *
   * @param request The ID of the request
   * @returns The request
   */
  @Query(() => SimulationRequest)
  async getSimulationRequest(
    @Args('request', { type: () => ID }, SimulationPipe) request: SimulationRequest
  ): Promise<SimulationRequest> {
    return request;
  }
}
