import { UserContext } from '@src/domain/services/user-context';

export interface TokenService {
  sign(payload: UserContext): Promise<string>;
  verify(token: string): Promise<UserContext>;
}

export const TOKEN_SERVICE = 'TOKEN_SERVICE';
