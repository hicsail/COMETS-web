import {
  GlobalParameters,
  LayoutParameters,
  ModelParameters,
  MetaboliteParameters
} from '../simulation/models/request.model';

export interface CometsLayoutParameters extends Omit<LayoutParameters, 'volume'> {
  spaceWidth: number;
  gridSize: number;
}

export interface CometsMetaboliteParameters extends Omit<MetaboliteParameters, 'concentration'> {
  amount: number;
}

export interface CometsModelParamters extends ModelParameters {}

export interface CometsGlobalParamters extends GlobalParameters {}

export interface CometsParameters {
  layoutParams: CometsLayoutParameters;

  metaboliteParams: CometsMetaboliteParameters;

  modelParams: CometsModelParamters[];

  globalParams: CometsGlobalParamters;

  s3Folder: string;

  requestID: string;
}
