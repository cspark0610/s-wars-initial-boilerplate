import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class SignUpBodyDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Correo electrónico del usuario. Debe ser único en el sistema.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña del usuario. Mínimo 6 caracteres.',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    enum: ['REGULAR', 'ADMIN'],
    example: 'ADMIN',
    description:
      'Rol asignado al usuario. Valores permitidos: REGULAR o ADMIN. Por defecto REGULAR.',
  })
  @IsOptional()
  @IsIn(['REGULAR', 'ADMIN'])
  role?: 'REGULAR' | 'ADMIN';
}
