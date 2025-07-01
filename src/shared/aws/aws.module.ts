import { Global, Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { SNSClient } from '@aws-sdk/client-sns';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { LocationClient } from '@aws-sdk/client-location';
import { S3Service } from './services/s3.service';
import { SNSService } from './services/sns.service';
import { SecretsManagerService } from './services/secrets-manager.service';
import { LocationService } from './services/location.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('S3Client');
        const clientConfig = {
          region: configService.get<string>('AWS_REGION', 'us-east-1'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID', 'test'),
            secretAccessKey: configService.get<string>(
              'AWS_SECRET_ACCESS_KEY',
              'test',
            ),
          },
          endpoint: configService.get<string>(
            'AWS_S3_ENDPOINT',
            'http://localhost:4566',
          ),
          forcePathStyle: true, // Necessário para LocalStack
        };

        logger.log(
          `S3 Client configured with endpoint: ${clientConfig.endpoint}`,
        );
        return new S3Client(clientConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: SNSClient,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('SNSClient');
        const clientConfig = {
          region: configService.get<string>('AWS_REGION', 'us-east-1'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID', 'test'),
            secretAccessKey: configService.get<string>(
              'AWS_SECRET_ACCESS_KEY',
              'test',
            ),
          },
          endpoint: configService.get<string>(
            'AWS_SNS_ENDPOINT',
            'http://localhost:4566',
          ),
        };

        logger.log(
          `SNS Client configured with endpoint: ${clientConfig.endpoint}`,
        );
        return new SNSClient(clientConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: SecretsManagerClient,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('SecretsManagerClient');
        const clientConfig = {
          region: configService.get<string>('AWS_REGION', 'us-east-1'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID', 'test'),
            secretAccessKey: configService.get<string>(
              'AWS_SECRET_ACCESS_KEY',
              'test',
            ),
          },
          endpoint: configService.get<string>(
            'AWS_SECRETS_MANAGER_ENDPOINT',
            'http://localhost:4566',
          ),
        };

        logger.log(
          `Secrets Manager Client configured with endpoint: ${clientConfig.endpoint}`,
        );
        return new SecretsManagerClient(clientConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: LocationClient,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('LocationClient');
        const clientConfig = {
          region: configService.get<string>('AWS_REGION', 'us-east-1'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID', 'test'),
            secretAccessKey: configService.get<string>(
              'AWS_SECRET_ACCESS_KEY',
              'test',
            ),
          },
          endpoint: configService.get<string>(
            'AWS_LOCATION_ENDPOINT',
            'http://localhost:4566',
          ),
        };

        logger.log(
          `Location Client configured with endpoint: ${clientConfig.endpoint}`,
        );
        return new LocationClient(clientConfig);
      },
      inject: [ConfigService],
    },
    S3Service,
    SNSService,
    SecretsManagerService,
    LocationService,
  ],
  exports: [S3Service, SNSService, SecretsManagerService, LocationService],
})
export class AWSModule {}
