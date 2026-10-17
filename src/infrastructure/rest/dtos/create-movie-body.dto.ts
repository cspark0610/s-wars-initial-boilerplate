import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieBodyDto {
  @ApiProperty({
    example: 'A New Hope',
    description: 'Título de la película.',
  })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({
    example: 4,
    description: 'Número de episodio de la película. Debe ser único en el sistema.',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  episodeId!: number;

  @ApiProperty({
    example: 'It is a period of civil war...',
    description: 'Texto de apertura (opening crawl) de la película.',
  })
  @IsString()
  openingCrawl!: string;

  @ApiProperty({
    example: 'George Lucas',
    description: 'Director de la película.',
  })
  @IsString()
  @MinLength(1)
  director!: string;

  @ApiProperty({
    example: 'Gary Kurtz',
    description: 'Productor de la película.',
  })
  @IsString()
  @MinLength(1)
  producer!: string;

  @ApiProperty({
    example: '1977-05-25',
    description: 'Fecha de estreno de la película en formato ISO 8601 (YYYY-MM-DD).',
  })
  @IsString()
  @MinLength(1)
  releaseDate!: string;

  @ApiPropertyOptional({
    example: 'https://www.swapi.tech/api/films/1',
    description: 'URL original del recurso en SWAPI. Se utiliza para trazabilidad.',
  })
  @IsOptional()
  @IsString()
  swapiUrl?: string;
}
