import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { RolesGuard } from '@src/infrastructure/rest/guard/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMock<ExecutionContext>();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow when user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const request = {
      user: { userId: '1', email: 'admin@example.com', role: 'ADMIN' },
    } as unknown as FastifyRequest;

    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({ getRequest: () => request }),
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny when user role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const request = {
      user: { userId: '1', email: 'user@example.com', role: 'REGULAR' },
    } as unknown as FastifyRequest;

    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({ getRequest: () => request }),
    });

    expect(guard.canActivate(context)).toBe(false);
  });
});
