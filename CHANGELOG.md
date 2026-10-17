# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-10-17

### Added

- Backend NestJS con arquitectura hexagonal.
- Autenticación JWT con roles `REGULAR` y `ADMIN`.
- CRUD de películas con persistencia en PostgreSQL via TypeORM.
- Integración con SWAPI: obtención de film por uid y sincronización masiva.
- Endpoint `GET /v1/movies/swapi/:uid` para consultar films directamente en SWAPI.
- Tests unitarios para auth, guards y cliente SWAPI.
- Tests de integración con SQLite en memoria.
- Collection de Postman en `docs/star-wars-movies-api.postman_collection.json`.
- Script `npm run swagger:build` para generar `docs/swagger.json` offline.
- Decoradores Swagger custom en `src/infrastructure/rest/swagger-decorators/`.
- Configuración de debug en `.vscode/launch.json`.
- Documentación de arquitectura en `ARCHITECTURE.md`.
- Migración inicial de TypeORM.

### Changed

- `UserEntity.role` usa `varchar` para compatibilidad con SQLite en tests.

### Removed

