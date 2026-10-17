import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'Token JWT de acceso. Se debe enviar en el header Authorization como Bearer.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6IkFETUlOIn0.signature',
  })
  access_token!: string;
}
