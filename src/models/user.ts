export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'GUEST_USER';
  createdAt?: string;
  updatedAt?: string;
}