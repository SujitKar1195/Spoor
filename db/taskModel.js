const {Schema, model} = require('mongoose');

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {timestamps: true}
);

const Task = model('task', taskSchema);

module.exports = Task;
