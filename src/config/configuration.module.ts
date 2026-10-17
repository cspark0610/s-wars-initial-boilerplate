import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import appConfig from './app-config';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'local').default('development'),
  PORT: Joi.number().default(3000),
  DB_TYPE: Joi.string().valid('postgres', 'sqlite').default('postgres'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('movies_user'),
  DB_PASSWORD: Joi.string().default('movies_pass'),
  DB_NAME: Joi.string().default('movies_db'),
  DB_SYNC: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().min(8).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  HTTP_TIMEOUT_MS: Joi.number().default(5000),
  HTTP_RETRY_MAX_ATTEMPTS: Joi.number().default(3),
  HTTP_RETRY_INITIAL_DELAY: Joi.number().default(100),
  HTTP_RETRY_MAX_DELAY: Joi.number().default(1000),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema,
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
