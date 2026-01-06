import type { User } from './user';

export interface Message {
  _id: string;
  project: string;
  sender: User;
  content: string;
  createdAt: string;
}
