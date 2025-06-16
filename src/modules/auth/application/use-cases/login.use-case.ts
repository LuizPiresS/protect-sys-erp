import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { LoginDto } from '../../presentation/http/dto/login.dto';
import { ISessionRepository } from '../../domain/repositories/session.repository.interface';
import { SessionEntity } from '../../domain/entities/session.entity';
import { Session } from 'inspector/promises';
import { SessionRepositoryToken } from '@inject-tokens/auth.tokens';
import { DomainException } from 'src/shared/errors/filters/global-exception.filter';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    @Inject(SessionRepositoryToken)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(input: LoginDto) {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    if (!user)
      throw new DomainException('Senha ou e-mail inválidos', 403, {
        errorCode: 'INVALID_CREDENTIALS',
      });

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    await this.sessionRepository.create(
      new SessionEntity(
        user.id,
        refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user.tenantId,
      ),
    );

    return { accessToken, refreshToken };
  }
}
