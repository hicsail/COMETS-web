import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { SimulationRequestInput } from './dtos/request.dto';
import { SimulationRequest, SimulationRequestDocument, SimulationStatus } from './models/request.model';
import { SimulationResult } from './models/result.model';

@Injectable()
export class SimulationService {
  constructor(
    @InjectQueue('simulationRequest') private simulationQueue: Queue,
    @InjectModel(SimulationRequest.name) private simulationRequestModel: Model<SimulationRequestDocument>
  ) {}

  async requestSimulation(requestInput: SimulationRequestInput) {
    // Store the simulation request
    const request = await this.simulationRequestModel.create({
      ...requestInput,
      status: SimulationStatus.IN_PROGRESS
    });

    await this.simulationQueue.add('request', request);
  }

  async makeComplete(requestID: string, result: SimulationResult): Promise<void> {
    await this.simulationRequestModel.updateOne(
      { _id: requestID },
      { $set: { status: SimulationStatus.SUCCESS, result }}
    );
  }

  async get(requestID: string): Promise<SimulationRequest | null> {
    return await this.simulationRequestModel.findById(requestID);
  }
}
