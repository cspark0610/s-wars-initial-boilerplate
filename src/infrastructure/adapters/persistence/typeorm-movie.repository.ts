import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '@src/domain/model/movie.model';
import { MovieRepository } from '@src/domain/ports/movie.repository';
import { MovieEntity } from './entities/movie.entity';

@Injectable()
export class TypeOrmMovieRepository implements MovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly repository: Repository<MovieEntity>,
  ) {}

  async findAll(page: number, limit: number): Promise<{ items: Movie[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { episodeId: 'ASC' },
    });

    return {
      items: entities.map((entity) => this.toModel(entity)),
      total,
    };
  }

  async findById(id: string): Promise<Movie | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toModel(entity) : null;
  }

  async create(movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Promise<Movie> {
    const entity = this.repository.create(movie);
    const saved = await this.repository.save(entity);
    return this.toModel(saved);
  }

  async save(movie: Movie): Promise<Movie> {
    const entity = this.repository.create(movie);
    const saved = await this.repository.save(entity);
    return this.toModel(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByEpisodeId(episodeId: number): Promise<boolean> {
    const count = await this.repository.count({ where: { episodeId } });
    return count > 0;
  }

  private toModel(entity: MovieEntity): Movie {
    return {
      id: entity.id,
      title: entity.title,
      episodeId: entity.episodeId,
      openingCrawl: entity.openingCrawl,
      director: entity.director,
      producer: entity.producer,
      releaseDate: entity.releaseDate,
      swapiUrl: entity.swapiUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
