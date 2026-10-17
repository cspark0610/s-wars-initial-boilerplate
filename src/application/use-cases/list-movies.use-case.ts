import { Injectable, Inject } from '@nestjs/common';
import { MovieRepository, MOVIE_REPOSITORY } from '@src/domain/ports/movie.repository';
import { ListMoviesQueryDto } from '@src/infrastructure/rest/dtos/list-movies-query.dto';
import {
  MovieListResponse,
  MovieResponse,
} from '@src/infrastructure/rest/responses/movie.response';

@Injectable()
export class ListMoviesUseCase {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository) {}

  async execute(query: ListMoviesQueryDto): Promise<MovieListResponse> {
    const { items, total } = await this.movieRepository.findAll(query.page, query.limit);

    return {
      items: items.map((movie) => this.toResponse(movie)),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  private toResponse(movie: {
    id: string;
    title: string;
    episodeId: number;
    openingCrawl: string;
    director: string;
    producer: string;
    releaseDate: string;
    swapiUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }): MovieResponse {
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
