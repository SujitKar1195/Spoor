const express = require('express');
const Task = require('../db/taskModel');
const router = express.Router();

router.get('/add-task', (req, res) => {
  return res.render('addTask', {
    user: req.user,
  });
});

router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id).populate('createdBy');

  return res.render('task', {
    user: req.user,
    task,
  });
});

router.post('/add-task', async (req, res) => {
  const {title, body} = req.body;

  const task = await Task.create({
    title,
    body,
    createdBy: `${req.user._id}`,
  });
  return res.redirect(`/task/${task._id}`);
});

router.post('/complete', async (req, res) => {
  const taskId = req.body.taskId;
  const task = await Task.findOne({_id: taskId});
  let isCompleted = task.isCompleted;
  if (isCompleted === false) {
    await Task.findByIdAndUpdate(taskId, {isCompleted: true});
    return res.status(200).json({isCompleted: true});
  } else {
    await Task.findByIdAndUpdate(taskId, {isCompleted: false});
    return res.status(200).json({isCompleted: false});
  }
});
router.post('/delete', async (req, res) => {
  const taskId = req.body.taskId;
  await Task.findByIdAndDelete(taskId);
  return res.status(200).json({deleted: true});
});

module.exports = router;
