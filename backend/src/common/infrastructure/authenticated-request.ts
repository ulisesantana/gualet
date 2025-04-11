import { Request } from 'express';

export interface AuthenticatedRequest extends Required<Request> {
  user: { userId: string; email: string };
}
