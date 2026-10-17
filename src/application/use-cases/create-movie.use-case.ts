import { Injectable, Inject } from '@nestjs/common';
import { MovieRepository, MOVIE_REPOSITORY } from '@src/domain/ports/movie.repository';
import { CreateMovieBodyDto } from '@src/infrastructure/rest/dtos/create-movie-body.dto';
import { MovieResponse } from '@src/infrastructure/rest/responses/movie.response';

@Injectable()
export class CreateMovieUseCase {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository) {}

  async execute(dto: CreateMovieBodyDto): Promise<MovieResponse> {
    const movie = await this.movieRepository.create({
      title: dto.title,
      episodeId: dto.episodeId,
      openingCrawl: dto.openingCrawl,
      director: dto.director,
      producer: dto.producer,
      releaseDate: dto.releaseDate,
      swapiUrl: dto.swapiUrl || '',
    });

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
