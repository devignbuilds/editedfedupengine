export interface Notification {
  _id: string;
  recipient: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
