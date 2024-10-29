import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ResultOutput } from './models/result.model';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject } from '@nestjs/common';

@Resolver(() => ResultOutput)
export class ResultOutputResolver {
  private readonly bucket: string = this.configService.getOrThrow<string>('s3.bucket');

  constructor(
    @Inject('S3_PROVIDER') private readonly s3Client: S3Client,
    private readonly configService: ConfigService
  ) {}

  @ResolveField(() => String)
  async url(@Parent() resultOutput: ResultOutput): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: resultOutput.location
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 60 * 15 });
  }
}
