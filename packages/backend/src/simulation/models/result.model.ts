import { Field, ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class ResultOutput {
  @Prop()
  @Field()
  key: string;

  @Prop()
  @Field()
  name: string;

  @Prop()
  @Field()
  location: string;
}

export const ResultOutputSchema = SchemaFactory.createForClass(ResultOutput);

@Schema()
@ObjectType()
export class FluxOutput {
  @Prop()
  @Field()
  modelID: string;

  @Prop()
  @Field()
  modelName: string;

  @Prop({ type: [ResultOutput]})
}


@Schema()
@ObjectType()
export class SimulationResult {
  @Prop({ type: [ResultOutput]})
  @Field(() => [ResultOutput])
  biomass: ResultOutput;

  @Prop({ type: [ResultOutput] })
}

export type SimulationResultDocument = SimulationResult & Document;
export const SimulationResultSchema = SchemaFactory.createForClass(SimulationResult);
