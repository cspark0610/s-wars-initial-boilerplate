import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigurationModule } from '@src/config/configuration.module';
import { CONTROLLERS, SERVICES, USE_CASES } from '@src/app.module-components';
import { UserEntity } from '@src/infrastructure/adapters/persistence/entities/user.entity';
import { MovieEntity } from '@src/infrastructure/adapters/persistence/entities/movie.entity';

export async function createTestingApp(): Promise<INestApplication> {
  process.env.JWT_SECRET = 'test-secret';
  process.env.NODE_ENV = 'test';
  process.env.DB_TYPE = 'sqlite';
  process.env.DB_SYNC = 'true';

  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigurationModule,
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [UserEntity, MovieEntity],
        synchronize: true,
        logging: false,
      }),
      TypeOrmModule.forFeature([UserEntity, MovieEntity]),
      JwtModule.register({
        secret: 'test-secret',
        signOptions: { expiresIn: '1h' },
      }),
    ],
    controllers: [...CONTROLLERS],
    providers: [...USE_CASES, ...SERVICES],
  }).compile();

  const app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}
