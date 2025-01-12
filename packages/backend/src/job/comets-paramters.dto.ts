import {
  GlobalParameters,
  LayoutParameters,
  ModelParameters,
  MetaboliteParameters
} from '../simulation/models/request.model';

/**
 * Layout parameters that will be sent to the COMETS-Runner. Does not include `volume` which
 * is a user provied option, but not one COMETS natively understands. Instead COMETS expects
 * `spaceWidth` and `gridSize`.
 */
export interface CometsLayoutParameters extends Omit<LayoutParameters, 'volume'> {
  spaceWidth: number;
  gridSize: number;
}

/**
 * Metabolite paramters that will be sent to the COMETS-Runner. Does not include `concentration`
 * which is a user provided option, but not one COMETS natively understands. Instead COMETS
 * expectes `amount`.
 */
export interface CometsMetaboliteParameters extends Omit<MetaboliteParameters, 'concentration'> {
  amount: number;
}

/** Model parameters that will be sent to the COMETS-Runner */
export interface CometsModelParamters extends ModelParameters {}

/** Global parameters that will be sent ot the COMETS-Runner */
export interface CometsGlobalParamters extends GlobalParameters {}

/** Representation of all the paraemeters th COMETS-Runner expects */
export interface CometsParameters {
  /** Layout parameters */
  layoutParams: CometsLayoutParameters;

  /** Metabolite parameters */
  metaboliteParams: CometsMetaboliteParameters;

  /** Model parameters */
  modelParams: CometsModelParamters[];

  /** Global parameters */
  globalParams: CometsGlobalParamters;

  /** Where to save the outputs in the S3 bucket */
  s3Folder: string;

  /** The ID of the request for identification after the COMETS-Runner has finished */
  requestID: string;
}
