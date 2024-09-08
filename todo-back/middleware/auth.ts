import {NextFunction, Request, Response} from 'express';
import type {HydratedDocument} from 'mongoose';
import User from '../models/User';
import type {UserFields, UserMethods} from '../types';

export interface RequestWithUser extends Request {
  user?: HydratedDocument<UserFields, UserMethods>;
}

export const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const headerValue = req.get('Authorization');

  if (!headerValue) {
    return res.status(401).send({error: 'Header "Authorization" not found'});
  }

  const [bearer, token] = headerValue.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({error: 'Invalid token format or token missing'});
  }

  const user = await User.findOne({token});

  if (!user) {
    return res.status(401).send({error: 'Wrong token'});
  }

  req.user = user;

  return next();
};
