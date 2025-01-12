import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ResultOutput } from './models/result.model';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject } from '@nestjs/common';

/** GraphQL resolver for viewing results */
@Resolver(() => ResultOutput)
export class ResultOutputResolver {
  private readonly bucket: string = this.configService.getOrThrow<string>('s3.bucket');

  constructor(
    @Inject('S3_PROVIDER') private readonly s3Client: S3Client,
    private readonly configService: ConfigService
  ) {}

  /**
   * Handles generating the URL for the given resource. This handles
   * converting the bucket location to a signed, expiring URL for the
   * end user to view the results.
   */
  @ResolveField(() => String)
  async url(@Parent() resultOutput: ResultOutput): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: resultOutput.location
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 60 * 15 });
  }
}
