export interface SwapiFilm {
  title: string;
  episodeId: number;
  openingCrawl: string;
  director: string;
  producer: string;
  releaseDate: string;
  url: string;
}

export interface SwapiService {
  getAllFilms(): Promise<SwapiFilm[]>;
  getFilmById(uid: string | number): Promise<SwapiFilm>;
}

export const SWAPI_SERVICE = 'SWAPI_SERVICE';
