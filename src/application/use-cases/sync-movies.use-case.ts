import { Injectable, Inject } from '@nestjs/common';
import {
  LOGGER_SERVICE,
  LoggerService,
  MOVIE_REPOSITORY,
  MovieRepository,
  SWAPI_SERVICE,
  SwapiService,
} from '@src/domain/ports';

@Injectable()
export class SyncMoviesUseCase {
  constructor(
    @Inject(SWAPI_SERVICE) private readonly swapiService: SwapiService,
    @Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<{ created: number; skipped: number }> {
    const films = await this.swapiService.getAllFilms();
    let created = 0;
    let skipped = 0;

    for (const film of films) {
      const exists = await this.movieRepository.existsByEpisodeId(film.episodeId);
      if (exists) {
        skipped++;
        continue;
      }

      await this.movieRepository.create({
        title: film.title,
        episodeId: film.episodeId,
        openingCrawl: film.openingCrawl,
        director: film.director,
        producer: film.producer,
        releaseDate: film.releaseDate,
        swapiUrl: film.url,
      });
      created++;
    }

    this.logger.info('Movies synchronized from SWAPI', { created, skipped });

    return { created, skipped };
  }
}
