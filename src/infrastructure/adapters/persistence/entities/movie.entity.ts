import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ name: 'episode_id', unique: true })
  episodeId!: number;

  @Column({ name: 'opening_crawl', type: 'text' })
  openingCrawl!: string;

  @Column()
  director!: string;

  @Column()
  producer!: string;

  @Column({ name: 'release_date' })
  releaseDate!: string;

  @Column({ name: 'swapi_url' })
  swapiUrl!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
