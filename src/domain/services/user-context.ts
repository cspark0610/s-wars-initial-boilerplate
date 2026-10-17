export interface UserContext {
  userId: string;
  email: string;
  role: 'REGULAR' | 'ADMIN';
}
