/* Generated File DO NOT EDIT. */
/* tslint:disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type FluxOutput = {
  __typename?: 'FluxOutput';
  flux: Array<ResultOutput>;
  modelID: Scalars['String']['output'];
  modelName: Scalars['String']['output'];
};

export type GlobalParameters = {
  __typename?: 'GlobalParameters';
  defaultDiffConst: Scalars['Float']['output'];
  defaultKm: Scalars['Float']['output'];
  defaultVMax: Scalars['Float']['output'];
  logFreq: Scalars['Float']['output'];
  maxCycles: Scalars['Float']['output'];
  timeStep: Scalars['Float']['output'];
};

export type GlobalParametersInput = {
  defaultDiffConst: Scalars['Float']['input'];
  defaultKm: Scalars['Float']['input'];
  defaultVMax: Scalars['Float']['input'];
  logFreq: Scalars['Float']['input'];
  maxCycles: Scalars['Float']['input'];
  timeStep: Scalars['Float']['input'];
};

export type LayoutParameters = {
  __typename?: 'LayoutParameters';
  type: LayoutType;
  volume: Scalars['Float']['output'];
};

export type LayoutParametersInput = {
  type: LayoutType;
  volume: Scalars['Float']['input'];
};

export enum LayoutType {
  PetriCenter = 'PETRI_CENTER',
  PetriRandom = 'PETRI_RANDOM',
  TestTube = 'TEST_TUBE'
}

export type MetaboliteParameters = {
  __typename?: 'MetaboliteParameters';
  concentration: Scalars['Float']['output'];
  type: MetaboliteType;
};

export type MetaboliteParametersInput = {
  concentration: Scalars['Float']['input'];
  type: MetaboliteType;
};

export enum MetaboliteType {
  Acetate = 'ACETATE',
  Glucose = 'GLUCOSE',
  Rich = 'RICH'
}

export enum ModelName {
  EColi = 'E_COLI',
  Nitrobacter = 'NITROBACTER',
  Nitrosomonas = 'NITROSOMONAS'
}

export type ModelParameters = {
  __typename?: 'ModelParameters';
  deathRate: Scalars['Float']['output'];
  linearDiffusivity: Scalars['Float']['output'];
  name: ModelName;
  neutralDrift: Scalars['Boolean']['output'];
  neutralDriftAmp: Scalars['Float']['output'];
  nonlinearDiffusivity: Scalars['Float']['output'];
};

export type ModelParametersInput = {
  deathRate: Scalars['Float']['input'];
  linearDiffusivity: Scalars['Float']['input'];
  name: ModelName;
  neutralDrift: Scalars['Boolean']['input'];
  neutralDriftAmp: Scalars['Float']['input'];
  nonlinearDiffusivity: Scalars['Float']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  requestSimulation: Scalars['Boolean']['output'];
};


export type MutationRequestSimulationArgs = {
  request: SimulationRequestInput;
};

export type Query = {
  __typename?: 'Query';
  getSimulationRequest: SimulationRequest;
};


export type QueryGetSimulationRequestArgs = {
  request: Scalars['ID']['input'];
};

export type ResultOutput = {
  __typename?: 'ResultOutput';
  key: Scalars['String']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type SimulationRequest = {
  __typename?: 'SimulationRequest';
  _id: Scalars['String']['output'];
  email: Scalars['String']['output'];
  globalParams: GlobalParameters;
  layoutParams: LayoutParameters;
  metaboliteParams: MetaboliteParameters;
  modelParams: Array<ModelParameters>;
  result?: Maybe<SimulationResult>;
  status: SimulationStatus;
};

export type SimulationRequestInput = {
  email: Scalars['String']['input'];
  globalParams: GlobalParametersInput;
  layoutParams: LayoutParametersInput;
  metaboliteParams: MetaboliteParametersInput;
  modelParams: Array<ModelParametersInput>;
};

export type SimulationResult = {
  __typename?: 'SimulationResult';
  biomass: Array<ResultOutput>;
  biomassSeries: ResultOutput;
  flux: Array<FluxOutput>;
  metabolite: Array<ResultOutput>;
  metaboliteSeries: ResultOutput;
  requestID: Scalars['String']['output'];
};

export enum SimulationStatus {
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS'
}
