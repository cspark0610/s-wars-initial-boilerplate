import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MovieIdParamDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identificador único de la película (UUID v4).',
  })
  @IsUUID()
  id!: string;
}
