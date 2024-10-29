import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { transportProvider } from './transport.provider';

@Module({
  providers: [EmailService, transportProvider],
  exports: [EmailService]
})
export class EmailModule {}
