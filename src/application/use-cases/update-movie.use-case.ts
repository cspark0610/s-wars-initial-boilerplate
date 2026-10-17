import { Injectable, Inject } from '@nestjs/common';
import { MovieRepository, MOVIE_REPOSITORY } from '@src/domain/ports/movie.repository';
import { MovieNotFoundError } from '@src/domain/errors/movie.errors';
import { UpdateMovieBodyDto } from '@src/infrastructure/rest/dtos/update-movie-body.dto';
import { MovieIdParamDto } from '@src/infrastructure/rest/dtos/movie-id-param.dto';
import { MovieResponse } from '@src/infrastructure/rest/responses/movie.response';

@Injectable()
export class UpdateMovieUseCase {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository) {}

  async execute(params: MovieIdParamDto, dto: UpdateMovieBodyDto): Promise<MovieResponse> {
    const existing = await this.movieRepository.findById(params.id);
    if (!existing) {
      throw new MovieNotFoundError(params.id);
    }

    const updated = await this.movieRepository.save({
      ...existing,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.episodeId !== undefined && { episodeId: dto.episodeId }),
      ...(dto.openingCrawl !== undefined && { openingCrawl: dto.openingCrawl }),
      ...(dto.director !== undefined && { director: dto.director }),
      ...(dto.producer !== undefined && { producer: dto.producer }),
      ...(dto.releaseDate !== undefined && { releaseDate: dto.releaseDate }),
      ...(dto.swapiUrl !== undefined && { swapiUrl: dto.swapiUrl }),
    });

    return {
      id: updated.id,
      title: updated.title,
      episodeId: updated.episodeId,
      openingCrawl: updated.openingCrawl,
      director: updated.director,
      producer: updated.producer,
      releaseDate: updated.releaseDate,
      swapiUrl: updated.swapiUrl,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
