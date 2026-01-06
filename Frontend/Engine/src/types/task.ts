import type { User } from './user';
import type { Project } from './project';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: Project;
  assignedTo?: User;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  tags?: string[];
  attachments?: { name: string; url: string }[];
  createdAt: string;
}
