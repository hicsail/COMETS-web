import { InputType, OmitType, Field } from '@nestjs/graphql';
import {
  GlobalParameters,
  LayoutParameters,
  MetaboliteParameters,
  ModelParameters,
  SimulationRequest
} from '../models/request.model';

/** GraphQL input for layout parameters */
@InputType()
export class LayoutParametersInput extends OmitType(LayoutParameters, [] as const, InputType) {}

/** GraphQL input for metabolite parameters */
@InputType()
export class MetaboliteParametersInput extends OmitType(MetaboliteParameters, [] as const, InputType) {}

/** GraphQL input for model parameters */
@InputType()
export class ModelParametersInput extends OmitType(ModelParameters, [] as const, InputType) {}

/** GraphQL input for global parameters */
@InputType()
export class GlobalParametersInput extends OmitType(GlobalParameters, [] as const, InputType) {}

/** GraphQL input for the whole request, including each parameter type */
@InputType()
export class SimulationRequestInput extends OmitType(
  SimulationRequest,
  [
    '_id',
    'modelParams',
    'status',
    'modelParams',
    'globalParams',
    'metaboliteParams',
    'result',
    'layoutParams'
  ] as const,
  InputType
) {
  @Field(() => LayoutParametersInput)
  layoutParams: LayoutParametersInput;

  @Field(() => MetaboliteParametersInput)
  metaboliteParams: MetaboliteParametersInput;

  @Field(() => [ModelParametersInput])
  modelParams: ModelParametersInput[];

  @Field(() => GlobalParametersInput)
  globalParams: GlobalParametersInput;
}
