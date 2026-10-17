import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageJson from '../../package.json';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Star Wars Movies API')
    .setDescription('Backend hexagonal para gestión de películas Star Wars con integración SWAPI')
    .setVersion(packageJson.version)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return document;
}
