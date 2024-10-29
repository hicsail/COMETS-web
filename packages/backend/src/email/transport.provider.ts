import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';


export const TRANSPORT_PROVIDER = 'TRANSPORT_PROVIDER';

export const transportProvider: Provider<Transporter> = {
  provide: TRANSPORT_PROVIDER,
  useFactory: (configService: ConfigService) => {
    return createTransport({
      host: configService.getOrThrow<string>('mail.host'),
      port: configService.getOrThrow<number>('mail.port'),
      secure: configService.getOrThrow<boolean>('mail.secure'),
      auth: {
        user: configService.getOrThrow<string>('mail.username'),
        pass: configService.getOrThrow<string>('mail.password')
      }
    });
  },
  inject: [ConfigService]
};
