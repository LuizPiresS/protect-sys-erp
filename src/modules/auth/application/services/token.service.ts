import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Role } from '../../domain/value-objects/roles.enum';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: any) {
    const roles = user.roles?.map((role: any) => role.name) || [];
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles,
      tenantId: user.tenantId,
    });
  }

  generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id, tenantId: user.tenantId },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );
  }
}
