export interface PasswordHasherService {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export const PASSWORD_HASHER = 'PASSWORD_HASHER';
