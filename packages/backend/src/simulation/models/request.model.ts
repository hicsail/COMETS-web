import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SimulationResult } from './result.model';

export enum LayoutType {
  PETRI_CENTER = 'petri_center',
  PETRI_RANDOM = 'petri_random',
  TEST_TUBE = 'test_tube'
}

registerEnumType(LayoutType, {
  name: 'LayoutType'
});

@ObjectType()
export class LayoutParameters {
  @Prop({ type: String, enum: LayoutType })
  @Field(() => LayoutType)
  type: LayoutType;

  @Prop()
  @Field()
  volume: number;
}

export enum MetaboliteType {
  GLUCOSE = 'glc__D_e',
  ACETATE = 'ac_e',
  RICH = 'rich'
}

registerEnumType(MetaboliteType, {
  name: 'MetaboliteType'
});

@ObjectType()
export class MetaboliteParameters {
  @Prop({ type: String, enum: MetaboliteType })
  @Field(() => MetaboliteType)
  type: MetaboliteType;

  @Prop()
  @Field()
  concentration: number;
}
export const MetaboliteParametersSchema = SchemaFactory.createForClass(MetaboliteParameters);

export enum ModelName {
  E_COLI = 'escherichia coli core',
  NITROSOMONAS = 'nitrosomonas europaea',
  NITROBACTER = 'nitrobacter winogradskyi'
}

registerEnumType(ModelName, {
  name: 'ModelName'
});

@ObjectType()
@Schema()
export class ModelParameters {
  @Prop({ type: String, enum: ModelName })
  @Field(() => ModelName)
  name: ModelName;

  @Prop()
  @Field()
  neutralDrift: boolean;

  @Prop()
  @Field()
  neutralDriftAmp: number;

  @Prop()
  @Field()
  deathRate: number;

  @Prop()
  @Field()
  linearDiffusivity: number;

  @Prop()
  @Field()
  nonlinearDiffusivity: number;
}
export const ModelParametersSchema = SchemaFactory.createForClass(ModelParameters);

@ObjectType()
@Schema()
export class GlobalParameters {
  @Prop()
  @Field()
  timeStep: number;

  @Prop()
  @Field()
  logFreq: number;

  @Prop()
  @Field()
  defaultDiffConst: number;

  @Prop()
  @Field()
  defaultVMax: number;

  @Prop()
  @Field()
  defaultKm: number;

  @Prop()
  @Field()
  maxCycles: number;
}
export const GlobalParametersSchema = SchemaFactory.createForClass(GlobalParameters);

export enum SimulationStatus {
  SUCCESS = 'success',
  IN_PROGRESS = 'in progress',
  FAILED = 'failed'
}

registerEnumType(SimulationStatus, {
  name: 'SimulationStatus'
});

@Schema()
@ObjectType()
export class SimulationRequest {
  @Field()
  _id: string;

  @Prop()
  @Field(() => String)
  email: string;

  @Prop()
  @Field(() => LayoutParameters)
  layoutParams: LayoutParameters;

  @Prop({ type: MetaboliteParameters })
  @Field(() => MetaboliteParameters)
  metaboliteParams: MetaboliteParameters;

  @Prop({ type: [ModelParameters] })
  @Field(() => [ModelParameters])
  modelParams: ModelParameters[];

  @Prop({ type: GlobalParameters })
  @Field(() => GlobalParameters)
  globalParams: GlobalParameters;

  @Prop({ type: String, enum: SimulationStatus })
  @Field(() => SimulationStatus)
  status: SimulationStatus;

  @Prop({ type: SimulationResult, required: false })
  @Field(() => SimulationResult, { nullable: true })
  result: SimulationResult | null;
}

export type SimulationRequestDocument = SimulationRequest & Document;
export const SimulationRequestSchema = SchemaFactory.createForClass(SimulationRequest);
