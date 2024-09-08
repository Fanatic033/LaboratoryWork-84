import mongoose, {Schema, Types} from 'mongoose';
import User from './User';



const TaskSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist',
    },
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['new', 'in progress', 'completed'],
    default: 'new'
  }
})


const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;