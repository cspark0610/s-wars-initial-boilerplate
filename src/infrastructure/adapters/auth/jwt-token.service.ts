import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@src/domain/ports/token.service';
import { UserContext } from '@src/domain/services/user-context';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: UserContext): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<UserContext> {
    return this.jwtService.verifyAsync<UserContext>(token);
  }
}
