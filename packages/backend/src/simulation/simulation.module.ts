import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobModule } from '../job/job.module';
import { SimulationResult, SimulationResultSchema } from './models/result.model';
import { SimulationResolver } from './simulation.resolver';
import { SimulationService } from './simulation.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { SimulationRequestConsumer } from './simulation.consumer';
import { SimulationRequest, SimulationRequestSchema } from './models/request.model';
import { SimulationCompletionProcessor } from './completion.consumer';
import { SimulationPipe } from './pipes/simulation.pipe';
import { ResultOutputResolver } from './result.resolver';
import { S3Module } from '../s3/s3.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SimulationRequest.name, schema: SimulationRequestSchema },
      { name: SimulationResult.name, schema: SimulationResultSchema }
    ]),
    BullModule.registerQueue({
      name: 'simulationRequest'
    }),
    BullModule.registerQueue({
      name: 'completion'
    }),
    BullBoardModule.forFeature({
      name: 'simulationRequest',
      adapter: BullMQAdapter
    }),
    BullBoardModule.forFeature({
      name: 'completion',
      adapter: BullMQAdapter
    }),
    JobModule,
    S3Module,
    EmailModule
  ],
  providers: [
    SimulationResolver,
    SimulationService,
    SimulationRequestConsumer,
    SimulationCompletionProcessor,
    SimulationPipe,
    ResultOutputResolver
  ]
})
export class SimulationModule {}
