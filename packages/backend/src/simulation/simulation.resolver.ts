import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { SimulationRequst } from './dtos/request.dto';
import { SimulationService } from './simulation.service';

@Resolver()
export class SimulationResolver {
  constructor(private readonly simulationService: SimulationService) {}

  @Mutation(() => Boolean)
  async requestSimuation(@Args('request') request: SimulationRequst): Promise<boolean> {
    await this.simulationService.requestSimulation(request);
    return true;
  }

  @Query(() => String)
  async example(): Promise<string> {
    return 'hello';
  }
}
