import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/services/auth.service';
import { TokenService } from './application/services/token.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { PrismaClient } from '@prisma/client';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { SessionRepository } from './infrastructure/persistence/repositories/session.repository';
import { SessionRepositoryToken } from '@inject-tokens/auth.tokens';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    PrismaClient,
    JwtStrategy,
    PrismaClient,
    { provide: SessionRepositoryToken, useClass: SessionRepository }, // Implemente!
  ],
  exports: [AuthService, TokenService, JwtStrategy],
})
export class AuthModule {}
