import { Controller, UsePipes, ValidationPipe, applyDecorators } from '@nestjs/common';

export function RestController(prefix: string): ClassDecorator {
  return applyDecorators(
    Controller(prefix),
    UsePipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    ),
  );
}
