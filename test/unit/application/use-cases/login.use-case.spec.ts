import { createMock } from '@golevelup/ts-jest';
import { LoginUseCase } from '@src/application/use-cases/login.use-case';
import { AuthService } from '@src/domain/services/auth.service';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = createMock<AuthService>();
    useCase = new LoginUseCase(authService);
  });

  it('should return access token', async () => {
    authService.login.mockResolvedValue({
      user: {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hash',
        role: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'token',
    });

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'Password123',
    });

    expect(result.access_token).toBe('token');
  });
});
