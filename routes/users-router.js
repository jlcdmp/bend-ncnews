const usersRouter = require('express').Router();

const { getUsers, addUser, getUserByID } = require('../controllers/users-controller');

usersRouter.route('/')
  .get(getUsers)
  .post(addUser);

usersRouter.get('/:username', getUserByID);


module.exports = usersRouter;
