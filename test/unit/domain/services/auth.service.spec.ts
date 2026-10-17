import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '@src/domain/services/auth.service';
import {
  LoggerService,
  PasswordHasherService,
  TokenService,
  UserRepository,
} from '@src/domain/ports';
import { InvalidCredentialsError, UserAlreadyExistsError } from '@src/domain/errors/movie.errors';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordHasher: jest.Mocked<PasswordHasherService>;
  let tokenService: jest.Mocked<TokenService>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    userRepository = createMock<UserRepository>();
    passwordHasher = createMock<PasswordHasherService>();
    tokenService = createMock<TokenService>();
    logger = createMock<LoggerService>();

    service = new AuthService(userRepository, passwordHasher, tokenService, logger);
  });

  describe('signUp', () => {
    it('should create a user and return token', async () => {
      userRepository.exists.mockResolvedValue(false);
      passwordHasher.hash.mockResolvedValue('hashed');
      userRepository.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashed',
        role: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      tokenService.sign.mockResolvedValue('token');

      const result = await service.signUp('test@example.com', 'Password123');

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('token');
    });

    it('should throw if user already exists', async () => {
      userRepository.exists.mockResolvedValue(true);

      await expect(service.signUp('test@example.com', 'Password123')).rejects.toBeInstanceOf(
        UserAlreadyExistsError,
      );
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashed',
        role: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      passwordHasher.compare.mockResolvedValue(true);
      tokenService.sign.mockResolvedValue('token');

      const result = await service.login('test@example.com', 'Password123');

      expect(result.token).toBe('token');
    });

    it('should throw InvalidCredentialsError for wrong password', async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashed',
        role: 'REGULAR',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      passwordHasher.compare.mockResolvedValue(false);

      await expect(service.login('test@example.com', 'Password123')).rejects.toBeInstanceOf(
        InvalidCredentialsError,
      );
    });
  });
});
