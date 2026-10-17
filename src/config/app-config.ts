import { registerAs } from '@nestjs/config';
import { ConfigKey } from './config-keys';

export default registerAs('app', () => ({
  [ConfigKey.NODE_ENV]: process.env.NODE_ENV || 'development',
  [ConfigKey.PORT]: parseInt(process.env.PORT ?? '3000', 10),
  [ConfigKey.DB_TYPE]: process.env.DB_TYPE || 'postgres',
  [ConfigKey.DB_HOST]: process.env.DB_HOST || 'localhost',
  [ConfigKey.DB_PORT]: parseInt(process.env.DB_PORT ?? '5432', 10),
  [ConfigKey.DB_USERNAME]: process.env.DB_USERNAME || 'movies_user',
  [ConfigKey.DB_PASSWORD]: process.env.DB_PASSWORD || 'movies_pass',
  [ConfigKey.DB_NAME]: process.env.DB_NAME || 'movies_db',
  [ConfigKey.DB_SYNC]: process.env.DB_SYNC === 'true',
  [ConfigKey.JWT_SECRET]: process.env.JWT_SECRET || 'change_me_in_production',
  [ConfigKey.JWT_EXPIRES_IN]: process.env.JWT_EXPIRES_IN || '1h',
  [ConfigKey.HTTP_TIMEOUT_MS]: parseInt(process.env.HTTP_TIMEOUT_MS ?? '5000', 10),
  [ConfigKey.HTTP_RETRY_MAX_ATTEMPTS]: parseInt(process.env.HTTP_RETRY_MAX_ATTEMPTS ?? '3', 10),
  [ConfigKey.HTTP_RETRY_INITIAL_DELAY]: parseInt(process.env.HTTP_RETRY_INITIAL_DELAY ?? '100', 10),
  [ConfigKey.HTTP_RETRY_MAX_DELAY]: parseInt(process.env.HTTP_RETRY_MAX_DELAY ?? '1000', 10),
}));
