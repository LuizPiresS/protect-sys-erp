import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/presentation/http/dto/login.dto';
import { RefreshTokenDto } from 'src/modules/auth/presentation/http/dto/refresh-token.dto';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from 'src/modules/auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from 'src/modules/auth/application/use-cases/refresh-token.use-case';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return this.logoutUseCase.execute(req.user.id);
  }
}
