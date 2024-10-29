import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const S3_PROVIDER = 'S3_PROVIDER';

export const s3Provider: Provider<S3Client> = {
  provide: S3_PROVIDER,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      credentials: {
        accessKeyId: configService.getOrThrow<string>('s3.accessID'),
        secretAccessKey: configService.getOrThrow<string>('s3.accessSecret')
      },
      endpoint: configService.getOrThrow<string>('s3.endpoint'),
      forcePathStyle: true
    });
  },
  inject: [ConfigService]
};
