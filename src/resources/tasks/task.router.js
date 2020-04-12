const router = require('express').Router({ mergeParams: true });
const taskService = require('./task.service');
const catchErrorsDecorator = require('../../helpers/error-decorator');
const validator = require('./../../middlewares/validator');
const ExtendedError = require('../../helpers/error-extended');
const Task = require('./task.model');

router.route('/').get(
  catchErrorsDecorator(async (req, res) => {
    const boardId = req.params.id;
    const tasks = await taskService.getAll(boardId);
    if (!tasks) throw new ExtendedError(404, 'Bad request');
    res.json(tasks);
  })
);

router.route('/:taskId').get(
  validator,
  catchErrorsDecorator(async (req, res) => {
    const { id, taskId } = req.params;
    const task = await taskService.getById(id, taskId);
    if (!task) throw new ExtendedError(404, 'Task not found');
    res.json(task);
  })
);

router.route('/').post(
  catchErrorsDecorator(async (req, res) => {
    const boardId = req.params.id;
    const task = new Task(req.body);
    if (!task) throw new ExtendedError(400, 'Bad request');
    task.boardId = boardId;
    const result = await taskService.addTask(task, boardId);
    res.json(result);
  })
);

router.route('/:id').put(
  validator,
  catchErrorsDecorator(async (req, res) => {
    const {
      body: update,
      params: { id }
    } = req;
    const result = await taskService.updateTask(id, update);
    if (!result) throw new ExtendedError(400, 'Bad request');
    res.json(result);
  })
);

router.route('/:id').delete(
  validator,
  catchErrorsDecorator(async (req, res) => {
    const { id } = req.params;
    const isSuccess = await taskService.deleteTask(id);
    if (!isSuccess) throw new ExtendedError(404, 'Task not found');
    res.status(204).send('Task was deleted successfully');
  })
);

module.exports = router;
