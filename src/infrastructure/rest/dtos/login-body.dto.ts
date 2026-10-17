import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginBodyDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Correo electrónico registrado en el sistema.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña asociada a la cuenta.',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
