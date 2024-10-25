import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobModule } from '../job/job.module';
import { SimulationResult, SimulationResultSchema } from './models/result.model';
import { SimulationResolver } from './simulation.resolver';
import { SimulationService } from './simulation.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SimulationResult.name, schema: SimulationResultSchema }]),
    JobModule
  ],
  providers: [SimulationResolver, SimulationService]
})
export class SimulationModule {}
