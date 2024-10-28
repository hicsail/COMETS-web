import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ResultOutput } from "./models/result.model";

@Resolver(() => ResultOutput)
export class ResultOutputResolver {
  @ResolveField(() => String)
  async url(@Parent() resultOutput: ResultOutput): Promise<string> {
    return '';
  }
}
