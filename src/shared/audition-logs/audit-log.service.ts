import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaClient) {}

  async log({
    tenantId,
    userId,
    action,
    details,
    level,
    correlationId,
  }: {
    tenantId: string;
    userId?: string;
    action: string;
    details?: string;
    level?: string;
    correlationId?: string;
  }) {
    await this.prisma.auditLog.create({
      data: { tenantId, userId, action, details, level, correlationId },
    });
  }
}
