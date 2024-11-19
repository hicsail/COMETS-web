import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { kubeProvider } from './kubectl.provider';
import { RequestConverter } from './converter.service';

@Module({
  providers: [JobService, kubeProvider, RequestConverter],
  exports: [JobService]
})
export class JobModule {}
