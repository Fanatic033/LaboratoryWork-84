import express from 'express';
import mongoose from 'mongoose';
import {auth, type RequestWithUser} from '../middleware/auth';
import {TaskI, UpdTask} from '../types';
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



tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const {id} = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send({error: 'Task not found'});
    }


    if (!task.user.equals(req.user!._id)) {
      return res.status(403).send({error: 'Not authorized to put this task'});
    }

    const updated: UpdTask = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };

    const updatedTask = await Task.findByIdAndUpdate(id, updated, {new: true, runValidators: true});

    if (!updatedTask) {
      return res.status(404).send({error: 'Task not found or failed to update'});
    }

    return res.send(updatedTask);
  } catch (error) {
    next(error);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {

    const {id} = req.params;

    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).send({error: 'Task not found'});
    }
    if (!task.user.equals(req.user!._id)) {
      return res.status(403).send({error: 'Not authorized to delete this task'});
    }

    await Task.deleteOne({_id: id});

    return res.send(`deleted Task: ${task}`);
  } catch (e) {
    next(e)
  }
})
