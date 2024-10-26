import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobModule } from '../job/job.module';
import { SimulationResult, SimulationResultSchema } from './models/result.model';
import { SimulationResolver } from './simulation.resolver';
import { SimulationService } from './simulation.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { SimulationRequestConsumer } from './simulation.consumer';
import { SimulationRequest, SimulationRequestSchema } from './models/request.model';
import { SimulationCompletionProcessor } from './completion.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SimulationRequest.name, schema: SimulationRequestSchema },
      { name: SimulationResult.name, schema: SimulationResultSchema }
    ]),
    BullModule.registerQueue({
      name: 'simulationRequest'
    }),
    BullBoardModule.forFeature({
      name: 'simulationRequest',
      adapter: BullMQAdapter
    }),
    JobModule
  ],
  providers: [SimulationResolver, SimulationService, SimulationRequestConsumer, SimulationCompletionProcessor]
})
export class SimulationModule {}
