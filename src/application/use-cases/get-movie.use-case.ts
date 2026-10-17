import { Injectable, Inject } from '@nestjs/common';
import { MovieRepository, MOVIE_REPOSITORY } from '@src/domain/ports/movie.repository';
import { MovieNotFoundError } from '@src/domain/errors/movie.errors';
import { MovieIdParamDto } from '@src/infrastructure/rest/dtos/movie-id-param.dto';
import { MovieResponse } from '@src/infrastructure/rest/responses/movie.response';

@Injectable()
export class GetMovieUseCase {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository) {}

  async execute(params: MovieIdParamDto): Promise<MovieResponse> {
    const movie = await this.movieRepository.findById(params.id);
    if (!movie) {
      throw new MovieNotFoundError(params.id);
    }

    return {
      id: movie.id,
      title: movie.title,
      episodeId: movie.episodeId,
      openingCrawl: movie.openingCrawl,
      director: movie.director,
      producer: movie.producer,
      releaseDate: movie.releaseDate,
      swapiUrl: movie.swapiUrl,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    };
  }
}
