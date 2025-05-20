import { User } from './user.model';

export interface Document {
  id: number;
  name: string;
  archive: string;
  loadDate: Date;
  user: User;
}