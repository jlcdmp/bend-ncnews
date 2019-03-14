const usersRouter = require('express').Router();

const { getUsers, addUser, getUserByID } = require('../controllers/users-controller');

usersRouter.get('/', getUsers);

usersRouter.post('/', addUser);

usersRouter.get('/:username', getUserByID);


module.exports = usersRouter;
