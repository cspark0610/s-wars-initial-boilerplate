import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@src/config/config-keys';
import { UserEntity } from './entities/user.entity';
import { MovieEntity } from './entities/movie.entity';

export const typeOrmConfigFactory: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const dbType = (process.env.DB_TYPE as 'postgres' | 'sqlite') ?? 'postgres';

    const baseConfig = {
      synchronize: configService.get<boolean>(ConfigKey.DB_SYNC),
      entities: [UserEntity, MovieEntity],
      logging: configService.get<string>(ConfigKey.NODE_ENV) === 'development',
    };

    if (dbType === 'sqlite') {
      return {
        ...baseConfig,
        type: 'sqlite',
        database: ':memory:',
      };
    }

    return {
      ...baseConfig,
      type: 'postgres',
      host: configService.get<string>(ConfigKey.DB_HOST),
      port: configService.get<number>(ConfigKey.DB_PORT),
      username: configService.get<string>(ConfigKey.DB_USERNAME),
      password: configService.get<string>(ConfigKey.DB_PASSWORD),
      database: configService.get<string>(ConfigKey.DB_NAME),
    };
  },
};
