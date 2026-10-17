import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/domain/services/auth.service';
import { LoginBodyDto } from '@src/infrastructure/rest/dtos/login-body.dto';
import { AuthResponse } from '@src/infrastructure/rest/responses/auth.response';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: LoginBodyDto): Promise<AuthResponse> {
    const { token } = await this.authService.login(dto.email, dto.password);
    return { access_token: token };
  }
}
