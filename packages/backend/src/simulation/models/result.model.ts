import { Field, ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class SimulationResult {
  @Field()
  dummy: string;
}

export type SimulationResultDocument = SimulationResult & Document;
export const SimulationResultSchema = SchemaFactory.createForClass(SimulationResult);
