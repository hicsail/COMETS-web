import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimulationResult, SimulationResultSchema } from './models/result.model';
import { SimulationResolver } from './simulation.resolver';
import { SimulationService } from './simulation.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SimulationResult.name, schema: SimulationResultSchema }])],
  providers: [SimulationResolver, SimulationService]
})
export class SimulationModule {}
