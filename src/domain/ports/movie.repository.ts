import { Movie } from '@src/domain/model/movie.model';

export interface MovieRepository {
  findAll(page: number, limit: number): Promise<{ items: Movie[]; total: number }>;
  findById(id: string): Promise<Movie | null>;
  create(movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Promise<Movie>;
  save(movie: Movie): Promise<Movie>;
  delete(id: string): Promise<void>;
  existsByEpisodeId(episodeId: number): Promise<boolean>;
}

export const MOVIE_REPOSITORY = 'MOVIE_REPOSITORY';
