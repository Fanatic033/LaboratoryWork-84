import mongoose, {Model} from 'mongoose';


export interface TaskI {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: string;
}

export type UpdTask = Omit<TaskI, "user">


export interface UserFields {
  username: string;
  password: string;
  token: string
}

export interface UserMethods {
  checkPassword(password: string): Promise<Boolean>;

  generateToken(): void
}

export type UserModel = Model<UserFields, {}, UserMethods>