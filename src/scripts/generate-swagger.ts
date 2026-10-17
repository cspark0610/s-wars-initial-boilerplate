import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../app.module';
import { setupSwagger } from '../config/swagger.setup';

async function generateSwagger(): Promise<void> {
  process.env.DB_TYPE = 'sqlite';
  process.env.NODE_ENV = 'swagger';
  process.env.JWT_SECRET = 'swagger-generation-secret';

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const document = setupSwagger(app);

  const outputPath = join(__dirname, '../../../docs');
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }

  const swaggerJsonPath = join(outputPath, 'swagger.json');
  writeFileSync(swaggerJsonPath, JSON.stringify(document, null, 2));

  console.log(`Swagger JSON generated at ${swaggerJsonPath}`);

  await app.close();
}

void generateSwagger();
