import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '@src/infrastructure/rest/guard/jwt-auth.guard';
import { TokenService } from '@src/domain/ports/token.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    tokenService = createMock<TokenService>();
    guard = new JwtAuthGuard(tokenService);
  });

  it('should allow access and set user for valid token', async () => {
    const user = { userId: '1', email: 'test@example.com', role: 'REGULAR' as const };
    tokenService.verify.mockResolvedValue(user);

    const request = {
      headers: { authorization: 'Bearer valid-token' },
    } as unknown as FastifyRequest;

    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(user);
  });

  it('should throw UnauthorizedException when header is missing', async () => {
    const request = { headers: {} } as unknown as FastifyRequest;
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    tokenService.verify.mockRejectedValue(new Error('invalid'));

    const request = {
      headers: { authorization: 'Bearer invalid-token' },
    } as unknown as FastifyRequest;

    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
