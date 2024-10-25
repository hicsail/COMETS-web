import { InputType, Field, registerEnumType } from '@nestjs/graphql';

export enum MetaboliteType {
  GLUCOSE = 'glc__D_e',
  ACETATE = 'ac_e',
  RICH = 'rich'
}

registerEnumType(MetaboliteType, {
  name: 'MetaboliteType'
});

@InputType()
export class MetaboliteParameters {
  @Field(() => MetaboliteType)
  type: MetaboliteType;

  @Field()
  amount: number;
}

export enum ModelName {
  E_COLI = 'escherichia coli core',
  NITROSOMONAS = 'nitrosomonas europaea',
  NITROBACTER = 'nitrobacter winogradskyi'
}

registerEnumType(ModelName, {
  name: 'ModelName'
});

@InputType()
export class ModelParameters {
  @Field(() => ModelName)
  name: ModelName;

  @Field()
  neutralDrift: boolean;

  @Field()
  neutralDriftAmp: number;

  @Field()
  deathRate: number;

  @Field()
  linearDiffusivity: number;

  @Field()
  nonlinearDiffusivity: number;
}

@InputType()
export class GlobalParameters {
  @Field()
  timeStep: number;

  @Field()
  logFreq: number;

  @Field()
  defaultDiffConst: number;

  @Field()
  defaultVMax: number;

  @Field()
  defaultKm: number;

  @Field()
  maxCycles: number;
}

@InputType()
export class SimulationRequst {
  @Field(() => String)
  email: string;

  @Field(() => MetaboliteParameters)
  metaboliteParams: MetaboliteParameters;

  @Field(() => [ModelParameters])
  modelParams: ModelParameters[];

  @Field(() => GlobalParameters)
  globalParams: GlobalParameters;
}
