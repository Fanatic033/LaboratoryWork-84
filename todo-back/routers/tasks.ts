import express from 'express';
import mongoose from 'mongoose';
import {auth, type RequestWithUser} from '../middleware/auth';
import {TaskI} from '../types';
import Task from '../models/Tasks';

export const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }

    const taskMutation: TaskI = {
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'new',
    };

    const task = new Task(taskMutation);
    await task.save();

    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }

    const tasks = await Task.find({user: req.user._id});

    return res.send(tasks);
  } catch (error) {
    return next(error);
  }
});
