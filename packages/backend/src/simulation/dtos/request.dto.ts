import { InputType, OmitType, Field } from '@nestjs/graphql';
import { GlobalParameters, LayoutParameters, MetaboliteParameters, ModelParameters, SimulationRequest } from '../models/request.model';

@InputType()
export class LayoutParametersInput extends OmitType(LayoutParameters, [] as const, InputType) {}

@InputType()
export class MetaboliteParametersInput extends OmitType(MetaboliteParameters, [] as const, InputType) {}

@InputType()
export class ModelParametersInput extends OmitType(ModelParameters, [] as const, InputType) {}

@InputType()
export class GlobalParametersInput extends OmitType(GlobalParameters, [] as const, InputType) {}

@InputType()
export class SimulationRequestInput extends OmitType(SimulationRequest, ['_id', 'modelParams', 'status', 'modelParams', 'globalParams', 'metaboliteParams', 'result', 'layoutParams'] as const, InputType) {
  @Field(() => LayoutParametersInput)
  layoutParams: LayoutParametersInput;

  @Field(() => MetaboliteParametersInput)
  metaboliteParams: MetaboliteParametersInput;

  @Field(() => [ModelParametersInput])
  modelParams: ModelParametersInput[];

  @Field(() => GlobalParametersInput)
  globalParams: GlobalParametersInput;
}
