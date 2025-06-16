import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SessionEntity } from '../../../domain/entities/session.entity';
import { ISessionRepository } from '../../../domain/repositories/session.repository.interface';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(session: SessionEntity): Promise<void> {
    await this.prisma.session.create({
      data: {
        userId: session.userId,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        tenantId: session.tenantId,
      },
    });
  }

  async findByRefreshToken(
    refreshToken: string,
  ): Promise<SessionEntity | null> {
    const dbSession = await this.prisma.session.findUnique({
      where: { refreshToken },
    });
    if (!dbSession) return null;
    return new SessionEntity(
      dbSession.userId,
      dbSession.refreshToken,
      dbSession.expiresAt,
      dbSession.tenantId,
    );
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userId } });
  }
}
