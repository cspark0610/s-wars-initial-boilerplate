import { Injectable, Inject } from '@nestjs/common';
import { User, UserRole } from '@src/domain/model/user.model';
import {
  LOGGER_SERVICE,
  LoggerService,
  PASSWORD_HASHER,
  PasswordHasherService,
  TOKEN_SERVICE,
  TokenService,
  USER_REPOSITORY,
  UserRepository,
} from '@src/domain/ports';
import { InvalidCredentialsError, UserAlreadyExistsError } from '@src/domain/errors/movie.errors';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasherService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  async signUp(
    email: string,
    password: string,
    role: UserRole = 'REGULAR',
  ): Promise<{ user: User; token: string }> {
    const exists = await this.userRepository.exists(email);
    if (exists) {
      throw new UserAlreadyExistsError(email);
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = await this.userRepository.create({ email, passwordHash, role });

    this.logger.info('User signed up', { userId: user.id, email: user.email });

    const token = await this.tokenService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const token = await this.tokenService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    this.logger.info('User logged in', { userId: user.id });

    return { user, token };
  }
}
