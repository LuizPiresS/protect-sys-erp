import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { ISessionRepository } from '../../domain/repositories/session.repository.interface';
import { PrismaClient } from '@prisma/client';
import { SessionRepositoryToken } from '@inject-tokens/auth.tokens';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(SessionRepositoryToken)
    private readonly sessionRepository: ISessionRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async execute(refreshToken: string) {
    const session =
      await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session) throw new Error('Invalid refresh token');

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) throw new Error('User not found');

    const newAccessToken = this.tokenService.generateAccessToken(user);
    return { accessToken: newAccessToken };
  }
}
