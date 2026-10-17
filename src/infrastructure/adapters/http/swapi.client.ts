import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwapiFilm, SwapiService } from '@src/domain/ports/swapi.service';
import { BaseClient } from './base-client';

interface SwapiListResponse {
  message?: string;
  result?: Array<{
    uid: string;
    properties?: Record<string, unknown>;
  }>;
  results?: Array<Record<string, unknown>>;
}

interface SwapiDetailResponse {
  result?: {
    properties?: Record<string, unknown>;
  };
  properties?: Record<string, unknown>;
}

@Injectable()
export class SwapiClient extends BaseClient implements SwapiService {
  constructor(configService: ConfigService) {
    super('https://www.swapi.tech/api', configService);
  }

  async getAllFilms(): Promise<SwapiFilm[]> {
    const data = await this.get<SwapiListResponse>('/films');
    const items = data.result || data.results || [];

    return items.map((item) => {
      const props = 'properties' in item ? item.properties : item;
      return this.mapFilm(props as Record<string, unknown>);
    });
  }

  async getFilmById(uid: string | number): Promise<SwapiFilm> {
    const data = await this.get<SwapiDetailResponse>(`/films/${uid}`);
    const props = data.result?.properties ?? data.properties;

    if (!props) {
      throw new Error(`Film ${uid} not found in SWAPI`);
    }

    return this.mapFilm(props);
  }

  private mapFilm(props: Record<string, unknown>): SwapiFilm {
    return {
      title: String(props.title || ''),
      episodeId: Number(props.episode_id ?? props.episodeId ?? 0),
      openingCrawl: String(props.opening_crawl ?? props.openingCrawl ?? ''),
      director: String(props.director || ''),
      producer: String(props.producer || ''),
      releaseDate: String(props.release_date ?? props.releaseDate ?? ''),
      url: String(props.url || ''),
    };
  }
}
