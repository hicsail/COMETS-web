import { Injectable } from '@nestjs/common';
import {
  CometsGlobalParamters,
  CometsLayoutParameters,
  CometsMetaboliteParameters,
  CometsModelParamters,
  CometsParameters
} from './comets-paramters.dto';
import { LayoutType, SimulationRequest } from '../simulation/models/request.model';

@Injectable()
export class RequestConverter {
  private readonly GRID_SIZE = 61;
  private readonly PETRI_DISH_DIAMETER = 3.0;

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

  private async getLayoutParams(request: SimulationRequest): Promise<CometsLayoutParameters> {
    let spaceWidth = Math.pow(request.layoutParams.volume, 1.0 / 3.0);
    let gridSize = 1;

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

  private async getModelParams(request: SimulationRequest): Promise<CometsModelParamters[]> {
    return request.modelParams;
  }

  private async getGlobalParams(request: SimulationRequest): Promise<CometsGlobalParamters> {
    return request.globalParams;
  }

  private async getS3Folder(request: SimulationRequest): Promise<string> {
    return request._id;
  }

  private async getRequestID(request: SimulationRequest): Promise<string> {
    return request._id;
  }
}
