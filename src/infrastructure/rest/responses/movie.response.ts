import { ApiProperty } from '@nestjs/swagger';

export class MovieResponse {
  @ApiProperty({
    description: 'Identificador único de la película.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({ description: 'Título de la película.', example: 'A New Hope' })
  title!: string;

  @ApiProperty({ description: 'Número de episodio.', example: 4 })
  episodeId!: number;

  @ApiProperty({
    description: 'Texto de apertura de la película.',
    example: 'It is a period of civil war...',
  })
  openingCrawl!: string;

  @ApiProperty({ description: 'Director de la película.', example: 'George Lucas' })
  director!: string;

  @ApiProperty({ description: 'Productor de la película.', example: 'Gary Kurtz' })
  producer!: string;

  @ApiProperty({ description: 'Fecha de estreno.', example: '1977-05-25' })
  releaseDate!: string;

  @ApiProperty({
    description: 'URL original del recurso en SWAPI.',
    example: 'https://www.swapi.tech/api/films/1',
  })
  swapiUrl!: string;

  @ApiProperty({ description: 'Fecha de creación del registro.' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro.' })
  updatedAt!: Date;
}

export class MovieListResponse {
  @ApiProperty({
    type: [MovieResponse],
    description: 'Lista de películas de la página solicitada.',
  })
  items!: MovieResponse[];

  @ApiProperty({ description: 'Cantidad total de películas disponibles.', example: 6 })
  total!: number;

  @ApiProperty({ description: 'Página actual.', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Tamaño de página.', example: 10 })
  limit!: number;
}
