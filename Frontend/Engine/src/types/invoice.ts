import type { User } from './user';
import type { Project } from './project';

export interface Invoice {
  _id: string;
  project: Project;
  client: User;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}
