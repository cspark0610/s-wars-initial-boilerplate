import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RestController } from '@src/infrastructure/rest/shared/rest.decorator';
import {
  ApiCreateMovie,
  ApiDeleteMovie,
  ApiGetMovie,
  ApiGetSwapiFilm,
  ApiListMovies,
  ApiLogin,
  ApiSignUp,
  ApiSyncMovies,
  ApiUpdateMovie,
} from '@src/infrastructure/rest/swagger-decorators/movies-swagger.decorators';
import { JwtAuthGuard } from '@src/infrastructure/rest/guard/jwt-auth.guard';
import { RolesGuard } from '@src/infrastructure/rest/guard/roles.guard';
import { Roles } from '@src/infrastructure/rest/decorators/roles.decorator';
import { SignUpUseCase } from '@src/application/use-cases/sign-up.use-case';
import { LoginUseCase } from '@src/application/use-cases/login.use-case';
import { ListMoviesUseCase } from '@src/application/use-cases/list-movies.use-case';
import { GetMovieUseCase } from '@src/application/use-cases/get-movie.use-case';
import { CreateMovieUseCase } from '@src/application/use-cases/create-movie.use-case';
import { UpdateMovieUseCase } from '@src/application/use-cases/update-movie.use-case';
import { DeleteMovieUseCase } from '@src/application/use-cases/delete-movie.use-case';
import { SyncMoviesUseCase } from '@src/application/use-cases/sync-movies.use-case';
import { GetSwapiFilmUseCase } from '@src/application/use-cases/get-swapi-film.use-case';
import { SignUpBodyDto } from '@src/infrastructure/rest/dtos/sign-up-body.dto';
import { LoginBodyDto } from '@src/infrastructure/rest/dtos/login-body.dto';
import { CreateMovieBodyDto } from '@src/infrastructure/rest/dtos/create-movie-body.dto';
import { UpdateMovieBodyDto } from '@src/infrastructure/rest/dtos/update-movie-body.dto';
import { MovieIdParamDto } from '@src/infrastructure/rest/dtos/movie-id-param.dto';
import { SwapiFilmIdParamDto } from '@src/infrastructure/rest/dtos/swapi-film-id-param.dto';
import { ListMoviesQueryDto } from '@src/infrastructure/rest/dtos/list-movies-query.dto';
import type { AuthResponse } from '@src/infrastructure/rest/responses/auth.response';
import type { SwapiFilm } from '@src/domain/ports/swapi.service';
import type {
  MovieListResponse,
  MovieResponse,
} from '@src/infrastructure/rest/responses/movie.response';

@ApiTags('Movies')
@RestController('v1')
export class MoviesController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly listMoviesUseCase: ListMoviesUseCase,
    private readonly getMovieUseCase: GetMovieUseCase,
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
    private readonly syncMoviesUseCase: SyncMoviesUseCase,
    private readonly getSwapiFilmUseCase: GetSwapiFilmUseCase,
  ) {}

  @Post('auth/sign-up')
  @ApiSignUp()
  signUp(@Body() dto: SignUpBodyDto): Promise<AuthResponse> {
    return this.signUpUseCase.execute(dto);
  }

  @Post('auth/login')
  @ApiLogin()
  login(@Body() dto: LoginBodyDto): Promise<AuthResponse> {
    return this.loginUseCase.execute(dto);
  }

  @Get('movies')
  @UseGuards(JwtAuthGuard)
  @ApiListMovies()
  listMovies(@Query() query: ListMoviesQueryDto): Promise<MovieListResponse> {
    return this.listMoviesUseCase.execute(query);
  }

  @Get('movies/:id')
  @UseGuards(JwtAuthGuard)
  @ApiGetMovie()
  getMovie(@Param() params: MovieIdParamDto): Promise<MovieResponse> {
    return this.getMovieUseCase.execute(params);
  }

  @Post('movies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiCreateMovie()
  createMovie(@Body() dto: CreateMovieBodyDto): Promise<MovieResponse> {
    return this.createMovieUseCase.execute(dto);
  }

  @Patch('movies/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiUpdateMovie()
  updateMovie(
    @Param() params: MovieIdParamDto,
    @Body() dto: UpdateMovieBodyDto,
  ): Promise<MovieResponse> {
    return this.updateMovieUseCase.execute(params, dto);
  }

  @Delete('movies/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiDeleteMovie()
  deleteMovie(@Param() params: MovieIdParamDto): Promise<void> {
    return this.deleteMovieUseCase.execute(params);
  }

  @Get('movies/swapi/:uid')
  @UseGuards(JwtAuthGuard)
  @ApiGetSwapiFilm()
  getSwapiFilm(@Param() params: SwapiFilmIdParamDto): Promise<SwapiFilm> {
    return this.getSwapiFilmUseCase.execute(params.uid);
  }

  @Post('movies/sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiSyncMovies()
  syncMovies(): Promise<{ created: number; skipped: number }> {
    return this.syncMoviesUseCase.execute();
  }
}
