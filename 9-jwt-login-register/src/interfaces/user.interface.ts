import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  id: string;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  registerDate?: string;
}