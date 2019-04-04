const { fetchUsers, postUser, fetchUserByID } = require('../models/users-model');


exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.send({ users }).status(200);
  })
    .catch(next);
};

exports.addUser = (req, res, next) => {
  const user = req.body;
  postUser(user).then(([newUser]) => {
    res.status(201).send({ newUser });
  })
    .catch(next);
};

exports.getUserByID = (req, res, next) => {
  const { username } = req.params;
  fetchUserByID(username).then(([user]) => {
    console.log(user);
    if (user === undefined) res.status(404).send({ message: `The username ${username} does not exsist` });
    else {
      res.status(200).send({ user });
    }
  })
    .catch(next);
};
