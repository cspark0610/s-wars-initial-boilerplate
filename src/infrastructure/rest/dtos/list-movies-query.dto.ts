import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ListMoviesQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Número de página a consultar.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Cantidad de elementos por página. Máximo 100.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit = 10;
}
