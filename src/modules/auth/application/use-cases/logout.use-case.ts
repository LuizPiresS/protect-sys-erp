import { Inject, Injectable } from '@nestjs/common';
import { ISessionRepository } from '../../domain/repositories/session.repository.interface';
import { SessionRepositoryToken } from '@inject-tokens/auth.tokens';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(SessionRepositoryToken)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(userId: string) {
    await this.sessionRepository.deleteByUserId(userId);
    return { message: 'Logout successful' };
  }
}
