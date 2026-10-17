import { UserContext } from '@src/domain/services/user-context';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserContext;
  }
}
