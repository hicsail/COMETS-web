import { Field, ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * GraphQL representation of output. The output from COMETS-Runner is
 * a series of figures saved as images. This tracks that structure.
 */
@Schema()
@ObjectType()
export class ResultOutput {
  /**
   * Way of representing the specific output.
   * For example "EX_ac_e" to represent a specific flux output
   */
  @Prop()
  @Field()
  key: string;

  /**
   * Human readable name for the output, used in UI
   */
  @Prop()
  @Field()
  name: string;

  /**
   * Where in the S3 bucket to find the figure
   */
  @Prop()
  @Field()
  location: string;
}

export const ResultOutputSchema = SchemaFactory.createForClass(ResultOutput);

/** GraphQL representation of the flux output */
@Schema()
@ObjectType()
export class FluxOutput {
  /** The ID of the model the flux results are for */
  @Prop()
  @Field()
  modelID: string;

  /** The human readable name of the model */
  @Prop()
  @Field()
  modelName: string;

  /** The list of flux outputs for the given model */
  @Prop({ type: [ResultOutput] })
  @Field(() => [ResultOutput])
  flux: ResultOutput[];
}

/** GraphQL representation of the whole simulation output */
@Schema()
@ObjectType()
export class SimulationResult {
  /** The ID of the original request */
  @Prop()
  @Field()
  requestID: string;

  /** The biomass results, a list for each model */
  @Prop({ type: [ResultOutput] })
  @Field(() => [ResultOutput])
  biomass: ResultOutput;

  /** The flux output, list for each model */
  @Prop({ type: [FluxOutput] })
  @Field(() => [FluxOutput])
  flux: FluxOutput[];

  /** The metabolite output, list for each model */
  @Prop({ type: [ResultOutput] })
  @Field(() => [ResultOutput])
  metabolite: ResultOutput[];

  /** Timeseries biomass output */
  @Prop({ type: ResultOutput })
  @Field(() => ResultOutput)
  biomassSeries: ResultOutput;

  /** Timeseries metabolite output */
  @Prop({ type: ResultOutput })
  @Field(() => ResultOutput)
  metaboliteSeries: ResultOutput;
}

export type SimulationResultDocument = SimulationResult & Document;
export const SimulationResultSchema = SchemaFactory.createForClass(SimulationResult);
