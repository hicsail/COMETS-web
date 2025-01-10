import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { SimulationRequestInput } from './dtos/request.dto';
import { SimulationRequest, SimulationRequestDocument, SimulationStatus } from './models/request.model';
import { SimulationResult } from './models/result.model';


/**
 * Service revolving around the simulation.
 */
@Injectable()
export class SimulationService {
  constructor(
    @InjectQueue('simulationRequest') private simulationQueue: Queue,
    @InjectModel(SimulationRequest.name) private simulationRequestModel: Model<SimulationRequestDocument>
  ) {}

  /**
   * Has the request added to the database then added the simulation to the request BullMQ queue.
   */
  async requestSimulation(requestInput: SimulationRequestInput) {
    // Store the simulation request
    const request = await this.simulationRequestModel.create({
      ...requestInput,
      status: SimulationStatus.IN_PROGRESS
    });

    await this.simulationQueue.add('request', request);
  }

  /**
   * Mark a simulation as complete. Updates the status and saves the results of the simulation
   *
   * @param requestID The id of the request to update
   * @param result The results of the simulation
   * @returns The update simulation (or null if the simulation didn't exist)
   */
  async makeComplete(requestID: string, result: SimulationResult): Promise<SimulationRequest | null> {
    return await this.simulationRequestModel.findOneAndUpdate(
      { _id: requestID },
      { $set: { status: SimulationStatus.SUCCESS, result } },
      { new: true }
    );
  }

  /**
   * Get a simulation by its ID
   */
  async get(requestID: string): Promise<SimulationRequest | null> {
    return await this.simulationRequestModel.findById(requestID);
  }
}
