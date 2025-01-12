import { Injectable } from '@nestjs/common';
import {
  CometsGlobalParamters,
  CometsLayoutParameters,
  CometsMetaboliteParameters,
  CometsModelParamters,
  CometsParameters
} from './comets-paramters.dto';
import { LayoutType, SimulationRequest } from '../simulation/models/request.model';

/**
 * Handles converting parameters the user has provided into parameters COMETS-Runner
 * understands. The user provides settings which may be more natural to reason with
 * (volume of container, concentration, etc). However, COMETS-Runner requires more
 * computer friendly values. This handles that convertion logic.
 */
@Injectable()
export class RequestConverter {
  private readonly GRID_SIZE = 61;
  private readonly PETRI_DISH_DIAMETER = 3.0;

  /**
   * Top level convertion logic. Calls each converter
   *
   * @param request The user simulation request
   * @returns The updated parameters that the COMETS-Runner can take in
   */
  async convert(request: SimulationRequest): Promise<CometsParameters> {
    return {
      layoutParams: await this.getLayoutParams(request),
      metaboliteParams: await this.getMetaboliteParams(request),
      modelParams: await this.getModelParams(request),
      globalParams: await this.getGlobalParams(request),
      s3Folder: await this.getS3Folder(request),
      requestID: await this.getRequestID(request)
    };
  }

  /**
   * Convert layout parameters into COMETS-Runner ready values. Converts the `volume` option
   * into `spaceWidth` and `gridSize`. The math to do so depends if the user selected a
   * petri dish or test tube.
   *
   * @param request The user simulation request
   * @returns The updated layout parameters that the COMETS-Runner can take in
   */
  private async getLayoutParams(request: SimulationRequest): Promise<CometsLayoutParameters> {
    // Default for a petri dish
    let spaceWidth = Math.pow(request.layoutParams.volume, 1.0 / 3.0);
    let gridSize = 1;

    // If the user selected test tube, use the test tube calculation
    if (request.layoutParams.type != LayoutType.TEST_TUBE) {
      spaceWidth = this.PETRI_DISH_DIAMETER / this.GRID_SIZE;
      gridSize = this.GRID_SIZE;
    }

    return {
      type: request.layoutParams.type,
      spaceWidth: spaceWidth,
      gridSize: gridSize
    };
  }

  /**
   * Convert metabolite parameters into COMETS-Runner ready values. Converts the `concentration`
   * value int `amount`. Takes into concideration the layout in order to calculate what the
   * metabolite amount should be.
   *
   * @param request The user simulation request
   * @returns The updated metabolite parameters that the COMETS-Runner can take in
   */
  private async getMetaboliteParams(request: SimulationRequest): Promise<CometsMetaboliteParameters> {
    let metaboliteAmount = 0;
    if (request.layoutParams.type == LayoutType.TEST_TUBE) {
      metaboliteAmount = request.layoutParams.volume * request.metaboliteParams.concentration;
    } else {
      const spaceWidth = this.PETRI_DISH_DIAMETER / this.GRID_SIZE;
      const area = Math.PI * Math.pow(0.5 * this.PETRI_DISH_DIAMETER, 2);
      metaboliteAmount =
        (request.metaboliteParams.concentration * request.layoutParams.volume * Math.pow(spaceWidth, 2)) / area;
    }

    return {
      type: request.metaboliteParams.type,
      amount: metaboliteAmount
    };
  }

  /**
   * Model parameters are already COMETS-Runner ready
   *
   * @param request The user simulation request
   * @returns The unaltered model parameters
   */
  private async getModelParams(request: SimulationRequest): Promise<CometsModelParamters[]> {
    return request.modelParams;
  }

  /**
   * Global parameters are already COMETS-Runner ready
   *
   * @param request The user simulation request
   * @returns The unaltered global parameters
   */
  private async getGlobalParams(request: SimulationRequest): Promise<CometsGlobalParamters> {
    return request.globalParams;
  }

  /**
   * The S3 folder will just be the request ID (will be unique)
   *
   * @param request The user simulation request
   * @returns The S3 folder name which is the request ID
   */
  private async getS3Folder(request: SimulationRequest): Promise<string> {
    return request._id;
  }

  /**
   * Gets the ID off the original request
   *
   * @param request The user simulation request
   * @returns The id off of the model
   */
  private async getRequestID(request: SimulationRequest): Promise<string> {
    return request._id;
  }
}
