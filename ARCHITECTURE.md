# Arquitectura y flujo de datos

Este documento describe cómo fluyen los datos en cada endpoint de la API, capa por capa.

## ¿Por qué arquitectura hexagonal?

La arquitectura hexagonal (también conocida como "puertos y adaptadores") fue elegida porque este proyecto integra múltiples tecnologías que pueden cambiar o evolucionar de forma independiente: una base de datos PostgreSQL, un cliente HTTP hacia SWAPI, autenticación JWT, hashing de contraseñas y un framework web (NestJS + Fastify).

### Principales beneficios para este caso

1. **Independencia del framework web**  
   La lógica de negocio vive en `domain/` y `application/`, sin depender de NestJS, Fastify ni de ningún detalle HTTP. Si en el futuro se decide cambiar a Express, GraphQL o incluso a una cola de mensajes, los casos de uso y servicios de dominio se mantienen intactos.

2. **Persistencia intercambiable**  
   El dominio define puertos (`UserRepository`, `MovieRepository`) y la implementación concreta usa TypeORM + PostgreSQL. Gracias a esto, los tests de integración y e2e pueden ejecutarse con SQLite en memoria sin modificar la lógica de negocio, y una futura migración a MongoDB o Prisma solo implicaría crear nuevos adaptadores.

3. **Integraciones externas aisladas**  
   SWAPI se consume a través del puerto `SwapiService` y la implementación `SwapiClient`. Esto permite mockear fácilmente la API externa en tests unitarios y cambiar de proveedor (por ejemplo, swapi.dev) sin tocar los casos de uso.

4. **Testabilidad**  
   Cada capa puede testearse de forma aislada:
   - **Unitarios**: servicios de dominio y casos de uso con mocks de puertos.
   - **Integración**: controllers con base de datos SQLite y adaptadores reales.
   - **E2E**: flujo completo desde HTTP hasta la base de datos.

5. **Separación de responsabilidades**  
   - `domain/`: modelos, reglas de negocio, errores y contratos (puertos).
   - `application/`: orquestación de casos de uso.
   - `infrastructure/`: detalles técnicos como HTTP, persistencia, autenticación y logging.

6. **Evita dependencias circulares y acoplamiento**  
   La regla "el dominio no importa de infraestructura" garantiza que los modelos y servicios de negocio no se contaminen con anotaciones de frameworks, decorators de ORM ni detalles de serialización.

### Resumen

La arquitectura hexagonal resulta conveniente porque encapsula la complejidad de las integraciones (SWAPI, JWT, TypeORM) detrás de puertos bien definidos, permitiendo que el núcleo de negocio permanezca estable, testeable y desacoplado de cualquier librería o infraestructura específica.

## Stack y capas

```
┌─────────────────────────────────────────────────────────────┐
│  Infrastructure / REST                                       │
│  Controller -> DTOs -> Guards -> Use Cases                   │
├─────────────────────────────────────────────────────────────┤
│  Application                                                 │
│  Use Cases -> Domain Services -> Ports                       │
├─────────────────────────────────────────────────────────────┤
│  Domain                                                      │
│  Models / Ports / Errors                                     │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure / Adapters                                   │
│  TypeORM Repositories / Bcrypt / JWT / SwapiClient / Logger  │
└─────────────────────────────────────────────────────────────┘
```

## Auth

### POST /v1/auth/sign-up

1. **REST**: `MoviesController.signUp` recibe `SignUpBodyDto` (email, password, role opcional).
2. **ValidationPipe** (de `@RestController`) valida y transforma el body.
3. **Use Case**: `SignUpUseCase.execute(dto)` delega a `AuthService.signUp`.
4. **Domain Service**: `AuthService`:
   - Pregunta al `UserRepository.exists(email)`.
   - Si existe, lanza `UserAlreadyExistsError`.
   - Hashea la contraseña con `PasswordHasher`.
   - Crea el usuario con `UserRepository.create(...)`.
   - Genera un JWT con `TokenService.sign({ userId, email, role })`.
5. **Adapter**: `TypeOrmUserRepository` persiste la entidad en PostgreSQL.
6. **Response**: `AuthResponse` con `access_token`.

### POST /v1/auth/login

1. **REST**: `MoviesController.login` recibe `LoginBodyDto`.
2. **Use Case**: `LoginUseCase.execute(dto)` delega a `AuthService.login`.
3. **Domain Service**: `AuthService`:
   - Busca el usuario por email (`UserRepository.findByEmail`).
   - Compara la contraseña con `PasswordHasher.compare`.
   - Si falla, lanza `InvalidCredentialsError`.
   - Firma el JWT.
4. **Response**: `AuthResponse`.

## Movies

Todos los endpoints de movies (salvo los públicos de auth) requieren `JwtAuthGuard`, que verifica el Bearer token usando `TokenService.verify`. Los endpoints de administración agregan `RolesGuard` + `@Roles('ADMIN')`.

### GET /v1/movies

1. **REST**: `MoviesController.listMovies` recibe `ListMoviesQueryDto` (page, limit).
2. **Use Case**: `ListMoviesUseCase.execute(query)`.
3. **Port**: `MovieRepository.findAll(page, limit)`.
4. **Adapter**: `TypeOrmMovieRepository` ejecuta `findAndCount` con paginación.
5. **Response**: `MovieListResponse` con items, total, page y limit.

### GET /v1/movies/:id

1. **REST**: `MoviesController.getMovie` recibe `MovieIdParamDto`.
2. **Use Case**: `GetMovieUseCase.execute(params)`.
3. **Port**: `MovieRepository.findById(id)`.
4. Si no existe, lanza `MovieNotFoundError`.
5. **Response**: `MovieResponse`.

### POST /v1/movies

1. **REST**: `MoviesController.createMovie` recibe `CreateMovieBodyDto`.
2. **Use Case**: `CreateMovieUseCase.execute(dto)`.
3. **Port**: `MovieRepository.create({ ...dto })`.
4. **Adapter**: `TypeOrmMovieRepository` persiste la película.
5. **Response**: `MovieResponse`.

### PATCH /v1/movies/:id

1. **REST**: `MoviesController.updateMovie` recibe `MovieIdParamDto` y `UpdateMovieBodyDto`.
2. **Use Case**: `UpdateMovieUseCase.execute(params, dto)`.
3. **Port**: `MovieRepository.findById(id)`; si no existe, `MovieNotFoundError`.
4. Mezcla los campos actualizables y llama a `MovieRepository.save(movie)`.
5. **Response**: `MovieResponse`.

### DELETE /v1/movies/:id

1. **REST**: `MoviesController.deleteMovie` recibe `MovieIdParamDto`.
2. **Use Case**: `DeleteMovieUseCase.execute(params)`.
3. **Port**: `MovieRepository.findById(id)`; si no existe, `MovieNotFoundError`.
4. Llama a `MovieRepository.delete(id)`.
5. **Response**: 200 sin body.

## SWAPI Integration

### GET /v1/movies/swapi/:uid

1. **REST**: `MoviesController.getSwapiFilm` recibe `SwapiFilmIdParamDto`.
2. **Use Case**: `GetSwapiFilmUseCase.execute(uid)`.
3. **Port**: `SwapiService.getFilmById(uid)`.
4. **Adapter**: `SwapiClient` (que extiende `BaseClient`):
   - Construye la URL `https://www.swapi.tech/api/films/{uid}`.
   - Ejecuta `GET` con timeout y retry.
   - Mapea `result.properties` al dominio `SwapiFilm`.
5. **Response**: objeto `SwapiFilm` directo.

### POST /v1/movies/sync

1. **REST**: `MoviesController.syncMovies` requiere rol ADMIN.
2. **Use Case**: `SyncMoviesUseCase.execute()`.
3. **Port**: `SwapiService.getAllFilms()`.
4. **Adapter**: `SwapiClient` hace `GET /films` y mapea cada película.
5. Por cada película de SWAPI:
   - Verifica `MovieRepository.existsByEpisodeId(episodeId)`.
   - Si no existe, la crea con `MovieRepository.create(...)`.
6. **Response**: `{ created, skipped }`.

## Manejo de errores

`GlobalExceptionFilter` (registrado como `APP_FILTER`) atrapa:

- `DomainError`: responde con el `statusCode` y `code` definidos en el error.
- `HttpException`: responde con el status HTTP correspondiente.
- Otros errores: 500 `INTERNAL_SERVER_ERROR`.

Ejemplo de errores de dominio:

- `UserAlreadyExistsError` -> 409
- `InvalidCredentialsError` -> 401
- `MovieNotFoundError` -> 404
- `UnauthorizedMovieActionError` -> 403

## Dependencias principales

| Componente | Implementación |
|------------|----------------|
| UserRepository | `TypeOrmUserRepository` |
| MovieRepository | `TypeOrmMovieRepository` |
| PasswordHasher | `BcryptPasswordHasherService` |
| TokenService | `JwtTokenService` |
| SwapiService | `SwapiClient` |
| LoggerService | `ConsoleLoggerAdapter` |
