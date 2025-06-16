import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { UserAlreadyExistsInterceptor } from './shared/errors/interceptors/user-already-existis.interceptor';
import { ConfigService } from '@nestjs/config';
import { UserDeletedFilter } from './shared/errors/filters/user-deleted.filter';
import { GlobalExceptionFilter } from './shared/errors/filters/global-exception.filter';
import { AuditLogService } from './shared/audition-logs/audit-log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({ origin: '*' });

  // Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Interceptors
  app.useGlobalInterceptors(new UserAlreadyExistsInterceptor());

  // Filters
  app.useGlobalFilters(new UserDeletedFilter());
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(AuditLogService)));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('swaggerTitle'))
    .setDescription(configService.get<string>('swaggerDescription'))
    .setVersion(process.env.npm_package_version)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('app.port'));
}
void bootstrap();
