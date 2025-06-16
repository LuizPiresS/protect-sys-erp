import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaClient) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantSlug = req.headers['x-tenant-slug'] || req.query.tenant;

    if (!tenantSlug) {
      return res.status(400).json({ message: 'Tenant não especificado' });
    }

    try {
      const tenant = await this.prisma.tenant.findFirst({
        where: { slug: tenantSlug as string, isActive: true },
      });

      if (!tenant) {
        return res.status(404).json({ message: 'Tenant não encontrado' });
      }

      // Adiciona o tenant ao request
      req['tenant'] = tenant;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao identificar tenant' });
    }
  }
}
