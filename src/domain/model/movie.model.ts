export interface Movie {
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
}
