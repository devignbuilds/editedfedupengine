export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
  avatar?: string;
  settings?: {
    theme: string;
    notifications: boolean;
  };
  token?: string;
}
