import { User } from '@src/domain/model/user.model';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  exists(email: string): Promise<boolean>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
