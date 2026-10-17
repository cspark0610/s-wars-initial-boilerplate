import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './config/configuration.module';
import { CONTROLLERS, SERVICES, USE_CASES } from './app.module-components';
import { typeOrmConfigFactory } from './infrastructure/adapters/persistence/typeorm.config';
import { UserEntity } from './infrastructure/adapters/persistence/entities/user.entity';
import { MovieEntity } from './infrastructure/adapters/persistence/entities/movie.entity';
import { ConfigKey } from './config/config-keys';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync(typeOrmConfigFactory),
    TypeOrmModule.forFeature([UserEntity, MovieEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigKey.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(ConfigKey.JWT_EXPIRES_IN) as never,
        },
      }),
    }),
  ],
  controllers: [...CONTROLLERS],
  providers: [...USE_CASES, ...SERVICES],
})
export class AppModule {}
