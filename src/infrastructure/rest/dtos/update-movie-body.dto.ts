import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieBodyDto {
  @ApiPropertyOptional({
    example: 'A New Hope',
    description: 'Nuevo título de la película.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Nuevo número de episodio.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  episodeId?: number;

  @ApiPropertyOptional({
    example: 'It is a period of civil war...',
    description: 'Nuevo texto de apertura.',
  })
  @IsOptional()
  @IsString()
  openingCrawl?: string;

  @ApiPropertyOptional({
    example: 'George Lucas',
    description: 'Nuevo director de la película.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  director?: string;

  @ApiPropertyOptional({
    example: 'Gary Kurtz',
    description: 'Nuevo productor de la película.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  producer?: string;

  @ApiPropertyOptional({
    example: '1977-05-25',
    description: 'Nueva fecha de estreno en formato ISO 8601.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  releaseDate?: string;

  @ApiPropertyOptional({
    example: 'https://www.swapi.tech/api/films/1',
    description: 'Nueva URL del recurso en SWAPI.',
  })
  @IsOptional()
  @IsString()
  swapiUrl?: string;
}
