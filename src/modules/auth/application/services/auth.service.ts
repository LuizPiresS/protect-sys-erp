import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<User | null>;
}
@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { roles: true }, // Include roles if needed
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
