import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SwapiFilmIdParamDto {
  @ApiProperty({
    example: '3',
    description: 'Identificador único del recurso films en SWAPI (uid).',
  })
  @IsString()
  uid!: string;
}
