import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { MovieEntity } from './entities/movie.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'movies_user',
  password: process.env.DB_PASSWORD || 'movies_pass',
  database: process.env.DB_NAME || 'movies_db',
  synchronize: false,
  entities: [UserEntity, MovieEntity],
  migrations: [__dirname + '/migrations/*.ts'],
});
