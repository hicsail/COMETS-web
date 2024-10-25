import { InputType, OmitType, Field } from '@nestjs/graphql';
import { GlobalParameters, MetaboliteParameters, ModelParameters, SimulationRequest } from '../models/request.model';

@InputType()
export class MetaboliteParametersInput extends OmitType(MetaboliteParameters, [] as const, InputType) {}

@InputType()
export class ModelParametersInput extends OmitType(ModelParameters, [] as const, InputType) {}

@InputType()
export class GlobalParametersInput extends OmitType(GlobalParameters, [] as const, InputType) {}

@InputType()
export class SimulationRequestInput extends OmitType(SimulationRequest, ['_id', 'modelParams', 'status', 'modelParams', 'globalParams', 'metaboliteParams'] as const, InputType) {
  @Field(() => MetaboliteParametersInput)
  metaboliteParams: MetaboliteParametersInput;

  @Field(() => [ModelParametersInput])
  modelParams: ModelParametersInput[];

  @Field(() => GlobalParametersInput)
  globalParams: GlobalParametersInput;
}
