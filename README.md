# Star Wars Movies API

Backend NestJS con arquitectura hexagonal que gestiona películas de Star Wars e integra la API pública [SWAPI](https://www.swapi.tech/api).

## Requisitos

- Node.js 22 LTS (ver `.nvmrc` y `engines` en `package.json`)
- Docker + Docker Compose
- npm

> Usá `nvm use` para seleccionar automáticamente la versión de Node indicada en `.nvmrc`.

## Instalación

```bash
npm install
```

## Configuración

```bash
cp .env.example .env
```

Valores por defecto para local:

```dotenv
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=movies_user
DB_PASSWORD=movies_pass
DB_NAME=movies_db
DB_SYNC=true
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=1h
HTTP_TIMEOUT_MS=5000
HTTP_RETRY_MAX_ATTEMPTS=3
HTTP_RETRY_INITIAL_DELAY=100
HTTP_RETRY_MAX_DELAY=1000
```

> En local se puede dejar `DB_SYNC=true` para que TypeORM cree las tablas automáticamente. En producción usar migraciones y `DB_SYNC=false`.

## Levantar PostgreSQL local

```bash
npm run db:up
```

Esto inicia un contenedor PostgreSQL en el puerto configurado (`5432` por defecto).

## Migraciones

La migración inicial está en `src/infrastructure/adapters/persistence/migrations/1730000000000-InitialMigration.ts`.

### Crear una nueva migración

Con PostgreSQL corriendo y `DB_SYNC=false`:

```bash
npm run migration:generate -- src/infrastructure/adapters/persistence/migrations/NombreMigracion
```

### Ejecutar migraciones

```bash
npm run migration:run
```

### Revertir la última migración

```bash
npm run migration:revert
```

## Ejecución

```bash
npm run start:dev
```

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api
- OpenAPI JSON: http://localhost:3000/api-json

## Generar OpenAPI JSON offline

```bash
npm run swagger:build
```

Genera el archivo `docs/swagger.json` en la raíz del proyecto, sin necesidad de tener PostgreSQL corriendo (usa SQLite en memoria durante la generación). Ese JSON contiene la especificación OpenAPI completa generada a partir de los decoradores Swagger de controladores, DTOs y responses.

## Tests

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run check
```

## Debug en VS Code

Se incluye `.vscode/launch.json` con configuraciones para:

- `Debug: NestJS start:dev`
- `Debug: Jest Unit Tests`
- `Debug: Jest Integration Tests`
- `Debug: Jest Current File`

## Postman

En `docs/star-wars-movies-api.postman_collection.json` está la collection lista para importar. Incluye variables `baseUrl`, `token` y `movieId`; el login guarda automáticamente el token en la variable de colección.

## Endpoints

| Método | Path | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | /v1/auth/sign-up | público | Registro de usuarios |
| POST | /v1/auth/login | público | Login y JWT |
| GET | /v1/movies | cualquier autenticado | Listar películas |
| GET | /v1/movies/:id | REGULAR / ADMIN | Detalle de película |
| POST | /v1/movies | ADMIN | Crear película |
| PATCH | /v1/movies/:id | ADMIN | Actualizar película |
| DELETE | /v1/movies/:id | ADMIN | Eliminar película |
| GET | /v1/movies/swapi/:uid | cualquier autenticado | Obtener película directo de SWAPI |
| POST | /v1/movies/sync | ADMIN | Sincronizar películas desde SWAPI |

## Ejemplos de curl

### Registro admin

```bash
curl -X POST http://localhost:3000/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123","role":"ADMIN"}'
```

### Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123"}'
```

### Obtener película desde SWAPI (requiere token)

```bash
curl http://localhost:3000/v1/movies/swapi/3 \
  -H "Authorization: Bearer <token>"
```

### Sincronizar con SWAPI

```bash
curl -X POST http://localhost:3000/v1/movies/sync \
  -H "Authorization: Bearer <admin_token>"
```

## Arquitectura

```
src/
├── application/use-cases/   # Casos de uso (lógica de aplicación)
├── config/                  # Configuración y Swagger
├── domain/                  # Modelos, puertos, errores, servicios
├── infrastructure/          # Adapters, REST, persistencia
├── scripts/                 # Scripts offline (generación de swagger)
└── main.ts
```

## Convenciones

- Arquitectura hexagonal
- Dependency Inversion via tokens string
- Fastify como motor HTTP
- TypeORM + PostgreSQL
- JWT para autenticación
- Swagger para documentación

## Documentación adicional

- [`ARCHITECTURE.md`](./ARCHITECTURE.md): flujo de datos por endpoint.
- [`CHANGELOG.md`](./CHANGELOG.md): historial de cambios.
