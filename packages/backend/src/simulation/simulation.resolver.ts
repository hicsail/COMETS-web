import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { SimulationRequst } from './dtos/request.dto';

@Resolver()
export class SimulationResolver {
  @Mutation(() => Boolean)
  async requestSimuation(@Args('request') request: SimulationRequst): Promise<boolean> {
    return true;
  }

  @Query(() => String)
  async example(): Promise<string> {
    return 'hello';
  }
}
