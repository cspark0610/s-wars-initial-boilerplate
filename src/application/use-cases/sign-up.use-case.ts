import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/domain/services/auth.service';
import { SignUpBodyDto } from '@src/infrastructure/rest/dtos/sign-up-body.dto';
import { AuthResponse } from '@src/infrastructure/rest/responses/auth.response';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: SignUpBodyDto): Promise<AuthResponse> {
    const { token } = await this.authService.signUp(dto.email, dto.password, dto.role);
    return { access_token: token };
  }
}
