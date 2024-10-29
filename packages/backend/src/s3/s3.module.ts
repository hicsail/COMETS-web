import { Module } from '@nestjs/common';
import { s3Provider } from './s3.provider';

@Module({
  providers: [s3Provider],
  exports: [s3Provider]
})
export class S3Module {}
