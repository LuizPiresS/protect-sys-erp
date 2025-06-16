import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GeocodingModule } from '../../shared/geocoding/geocoding.module';
import { ProfileController } from './presentation/controllers/profile.controller';
import { ProfileRepository } from './infrastructure/persistence/repositories/profile.repository';
import {
  CreateProfileUseCaseToken,
  ProfileMapperServiceToken,
  ProfileRepositoryToken,
} from '@inject-tokens/profile.tokens';
import { CreateProfileUseCase } from './application/use-cases/create-profile.use-case';
import { ProfileMapperService } from './application/mappers/profile-mapper.service';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [GeocodingModule, TenantModule],
  exports: [],
  controllers: [ProfileController],
  providers: [
    PrismaClient,
    {
      provide: ProfileMapperServiceToken,
      useClass: ProfileMapperService,
    },
    {
      provide: ProfileRepositoryToken,
      useClass: ProfileRepository,
    },

    {
      provide: CreateProfileUseCaseToken,
      useClass: CreateProfileUseCase,
    },
  ],
})
export class ProfileModule {}
