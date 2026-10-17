import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from '@src/infrastructure/rest/responses/auth.response';
import {
  MovieListResponse,
  MovieResponse,
} from '@src/infrastructure/rest/responses/movie.response';

/**
 * Documentación de Swagger para el endpoint de registro de usuarios.
 * Permite crear una nueva cuenta proporcionando email, contraseña y rol opcional.
 */
export function ApiSignUp() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar un nuevo usuario',
      description:
        'Crea una cuenta de usuario en el sistema. El email debe ser único. ' +
        'Si no se indica rol, se asigna REGULAR por defecto. Devuelve un JWT de acceso.',
    }),
    ApiOkResponse({
      type: AuthResponse,
      description: 'Usuario registrado correctamente. Retorna el token de acceso.',
    }),
  );
}

/**
 * Documentación de Swagger para el endpoint de inicio de sesión.
 * Valida credenciales y devuelve un JWT para acceder a endpoints protegidos.
 */
export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión',
      description:
        'Autentica un usuario existente mediante email y contraseña. ' +
        'Si las credenciales son válidas, devuelve un JWT con los claims del usuario.',
    }),
    ApiOkResponse({
      type: AuthResponse,
      description: 'Autenticación exitosa. Retorna el token de acceso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Credenciales inválidas o usuario no encontrado.',
    }),
  );
}

/**
 * Documentación de Swagger para el listado paginado de películas.
 * Requiere un JWT válido. Cualquier usuario autenticado puede consultarlo.
 */
export function ApiListMovies() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar películas',
      description:
        'Obtiene un listado paginado de las películas almacenadas en la base de datos. ' +
        'Se puede controlar la página y el tamaño mediante query params.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      type: MovieListResponse,
      description: 'Listado de películas con metadatos de paginación.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token ausente, expirado o inválido.',
    }),
  );
}

/**
 * Documentación de Swagger para obtener el detalle de una película por su id.
 */
export function ApiGetMovie() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener detalle de una película',
      description:
        'Recupera la información completa de una película a partir de su identificador UUID.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      type: MovieResponse,
      description: 'Detalle de la película solicitada.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token ausente, expirado o inválido.',
    }),
    ApiNotFoundResponse({
      description: 'No existe una película con el id proporcionado.',
    }),
  );
}

/**
 * Documentación de Swagger para crear una nueva película.
 * Solo los usuarios con rol ADMIN pueden ejecutar esta operación.
 */
export function ApiCreateMovie() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear una película',
      description:
        'Registra una nueva película en el sistema. ' +
        'El campo episodeId debe ser único. Requiere rol ADMIN.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      type: MovieResponse,
      description: 'Película creada correctamente.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token ausente, expirado o inválido.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no posee el rol ADMIN necesario.',
    }),
  );
}

/**
 * Documentación de Swagger para actualizar una película existente.
 * Solo los usuarios con rol ADMIN pueden ejecutar esta operación.
 */
export function ApiUpdateMovie() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar una película',
      description:
        'Modifica uno o más campos de una película identificada por su UUID. ' +
        'Solo se actualizan los campos enviados en el body. Requiere rol ADMIN.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      type: MovieResponse,
      description: 'Película actualizada correctamente.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token ausente, expirado o inválido.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no posee el rol ADMIN necesario.',
    }),
    ApiNotFoundResponse({
      description: 'No existe una película con el id proporcionado.',
    }),
  );
}

/**
 * Documentación de Swagger para eliminar una película.
 * Solo los usuarios con rol ADMIN pueden ejecutar esta operación.
 */
export function ApiDeleteMovie() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar una película',
      description:
        'Elimina permanentemente una película del sistema a partir de su UUID. ' +
        'Requiere rol ADMIN.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      description: 'Película eliminada correctamente.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token ausente, expirado o inválido.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no posee el rol ADMIN necesario.',
    }),
    ApiNotFoundResponse({
      description: 'No existe una película con el id proporcionado.',
    }),
  );
}

/**
 * Documentación de Swagger para consultar una película directamente desde SWAPI.
 */
export function ApiGetSwapiFilm() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener película de SWAPI por uid',
      description:
        'Consulta la API pública de Star Wars (SWAPI) en https://www.swapi.tech/api/films/{uid} ' +
        'y devuelve los datos mapeados al dominio de la aplicación.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      description: 'Datos de la película obtenidos desde SWAPI.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token ausente, expirado o inválido.',
    }),
  );
}

/**
 * Documentación de Swagger para sincronizar películas desde SWAPI.
 * Solo los usuarios con rol ADMIN pueden ejecutar esta operación.
 */
export function ApiSyncMovies() {
  return applyDecorators(
    ApiOperation({
      summary: 'Sincronizar películas desde SWAPI',
      description:
        'Obtiene todas las películas disponibles en SWAPI y las almacena en la base de datos local. ' +
        'Las películas cuyo episodeId ya existan son omitidas. Requiere rol ADMIN.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      description: 'Resultado de la sincronización con cantidad de creadas y omitidas.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token ausente, expirado o inválido.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no posee el rol ADMIN necesario.',
    }),
  );
}
