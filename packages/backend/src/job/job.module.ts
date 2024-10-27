import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { kubeProvider } from './kubectl.provider';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [

  ],
  providers: [JobService, kubeProvider],
  exports: [JobService]
})
export class JobModule {}
