import type { User } from './user';

export interface Project {
  _id: string;
  name: string;
  description?: string;
  client: User;
  employees: User[];
  status: 'active' | 'paused' | 'completed' | 'pending';
  deadline?: string;
  budget?: number;
  tags?: string[];
  milestones?: {
    _id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
  }[];
  createdAt: string;
}
