import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { HashingModule } from './shared/hashing/hashing.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './shared/config/env.validation';
import AppConfig from './shared/config/app.config';
import MailConfig from './shared/config/mail.config';
import SwaggerConfig from './shared/config/swagger.config';
import { ProfileModule } from './modules/profiles/profile.module';
import geocodingConfig from './shared/config/geocoding.config';
import { GeocodingModule } from './shared/geocoding/geocoding.module';
import { UserModule } from './modules/users/users.module';
import { TenantMiddleware } from './core/middlewares/tenant.middleware';
import { TenantModule } from './modules/tenant/tenant.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { CorrelationIdMiddleware } from './core/middlewares/correlation-id.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { RoleManagementModule } from './modules/role-management/role-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [AppConfig, MailConfig, SwaggerConfig, geocodingConfig],
    }),
    UserModule,
    ProfileModule,
    HashingModule,
    GeocodingModule,
    TenantModule,
    PrismaModule,
    AuthModule,
    RoleManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        // { path: 'users', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'tenants', method: RequestMethod.POST },
        { path: 'super-admin', method: RequestMethod.ALL },
      )
      .forRoutes('*'); // Aplica a todas as rotas

    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
