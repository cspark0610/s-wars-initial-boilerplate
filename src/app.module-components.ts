import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@src/infrastructure/rest/shared/global-exception.filter';
import { MoviesController } from '@src/infrastructure/rest/controllers/movies.controller';
import { SignUpUseCase } from '@src/application/use-cases/sign-up.use-case';
import { LoginUseCase } from '@src/application/use-cases/login.use-case';
import { ListMoviesUseCase } from '@src/application/use-cases/list-movies.use-case';
import { GetMovieUseCase } from '@src/application/use-cases/get-movie.use-case';
import { CreateMovieUseCase } from '@src/application/use-cases/create-movie.use-case';
import { UpdateMovieUseCase } from '@src/application/use-cases/update-movie.use-case';
import { DeleteMovieUseCase } from '@src/application/use-cases/delete-movie.use-case';
import { SyncMoviesUseCase } from '@src/application/use-cases/sync-movies.use-case';
import { GetSwapiFilmUseCase } from '@src/application/use-cases/get-swapi-film.use-case';
import { AuthService } from '@src/domain/services/auth.service';
import { JwtAuthGuard } from '@src/infrastructure/rest/guard/jwt-auth.guard';
import { RolesGuard } from '@src/infrastructure/rest/guard/roles.guard';
import { TypeOrmUserRepository } from '@src/infrastructure/adapters/persistence/typeorm-user.repository';
import { TypeOrmMovieRepository } from '@src/infrastructure/adapters/persistence/typeorm-movie.repository';
import { BcryptPasswordHasherService } from '@src/infrastructure/adapters/auth/bcrypt-password-hasher.service';
import { JwtTokenService } from '@src/infrastructure/adapters/auth/jwt-token.service';
import { SwapiClient } from '@src/infrastructure/adapters/http/swapi.client';
import { ConsoleLoggerAdapter } from '@src/infrastructure/adapters/logger/console-logger.adapter';
import {
  LOGGER_SERVICE,
  MOVIE_REPOSITORY,
  PASSWORD_HASHER,
  SWAPI_SERVICE,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from '@src/domain/ports';

export const USE_CASES = [
  SignUpUseCase,
  LoginUseCase,
  ListMoviesUseCase,
  GetMovieUseCase,
  CreateMovieUseCase,
  UpdateMovieUseCase,
  DeleteMovieUseCase,
  SyncMoviesUseCase,
  GetSwapiFilmUseCase,
];

export const SERVICES = [
  AuthService,
  { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
  { provide: MOVIE_REPOSITORY, useClass: TypeOrmMovieRepository },
  { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasherService },
  { provide: TOKEN_SERVICE, useClass: JwtTokenService },
  { provide: SWAPI_SERVICE, useClass: SwapiClient },
  { provide: LOGGER_SERVICE, useClass: ConsoleLoggerAdapter },
  JwtAuthGuard,
  RolesGuard,
  { provide: APP_FILTER, useClass: GlobalExceptionFilter },
];

export const CONTROLLERS = [MoviesController];
