import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRequestInput } from './dtos/request.dto';
import { SimulationRequest, SimulationRequestDocument, SimulationStatus } from './models/request.model';
import { SimulationResult } from './models/result.model';
import { JobService } from '../job/job.service';

@Injectable()
export class SimulationService {
  constructor(
    @InjectModel(SimulationRequest.name) private readonly simulationRequestModel: Model<SimulationRequestDocument>,
    private readonly jobService: JobService
  ) {}

  async requestSimulation(requestInput: SimulationRequestInput) {
    // Store the simulation request
    const request = await this.simulationRequestModel.create({
      ...requestInput,
      status: SimulationStatus.IN_PROGRESS
    });

    await this.jobService.triggerJob(request);
  }

  async makeComplete(requestID: string, result: SimulationResult): Promise<SimulationRequest | null> {
    return await this.simulationRequestModel.findOneAndUpdate(
      { _id: requestID },
      { $set: { status: SimulationStatus.SUCCESS, result } },
      { new: true }
    );
  }

  async markFailure(requestID: string): Promise<SimulationRequest | null> {
    return await this.simulationRequestModel.findOneAndUpdate(
      { _id: requestID },
      { $set: { status: SimulationStatus.FAILED } },
      { new: true }
    );
  }

  async get(requestID: string): Promise<SimulationRequest | null> {
    return await this.simulationRequestModel.findById(requestID);
  }
}
