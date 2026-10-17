import { DomainError } from './domain.error';

export class UserAlreadyExistsError extends DomainError {
  public readonly code = 'USER_ALREADY_EXISTS';
  public readonly statusCode = 409;

  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class InvalidCredentialsError extends DomainError {
  public readonly code = 'INVALID_CREDENTIALS';
  public readonly statusCode = 401;

  constructor() {
    super('Invalid credentials');
  }
}

export class MovieNotFoundError extends DomainError {
  public readonly code = 'MOVIE_NOT_FOUND';
  public readonly statusCode = 404;

  constructor(id: string) {
    super(`Movie with id ${id} not found`);
  }
}

export class UnauthorizedMovieActionError extends DomainError {
  public readonly code = 'UNAUTHORIZED_MOVIE_ACTION';
  public readonly statusCode = 403;

  constructor() {
    super('You are not authorized to perform this action');
  }
}
