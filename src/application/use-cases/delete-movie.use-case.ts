import { Injectable, Inject } from '@nestjs/common';
import { MovieRepository, MOVIE_REPOSITORY } from '@src/domain/ports/movie.repository';
import { MovieNotFoundError } from '@src/domain/errors/movie.errors';
import { MovieIdParamDto } from '@src/infrastructure/rest/dtos/movie-id-param.dto';

@Injectable()
export class DeleteMovieUseCase {
  constructor(@Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository) {}

  async execute(params: MovieIdParamDto): Promise<void> {
    const existing = await this.movieRepository.findById(params.id);
    if (!existing) {
      throw new MovieNotFoundError(params.id);
    }

    await this.movieRepository.delete(params.id);
  }
}
