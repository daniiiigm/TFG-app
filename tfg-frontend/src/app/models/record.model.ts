import { User } from './user.model';

export interface Record {
  id: number;
  checkIn: Date;
  checkOut: Date;
  user: User;
}

export interface RecordDTO {
  checkIn: Date;
  checkOut: Date;
}
