const { fetchUsers, postUser, fetchUserByID } = require('../models/users-model');

console.log('usercontroller');


exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.send({ users }).status(200);
  })
    .catch(err => console.log(err));
};

exports.addUser = (req, res, next) => {
  const user = req.body;
  postUser(user).then((newUser) => {
    res.status(201).send({ newUser });
  })
    .catch(err => console.log(err));
};

exports.getUserByID = (req, res, next) => {
  const username = req.params;
  fetchUserByID(username).then((user) => {
    res.status(200).send({ user });
  })
    .catch(err => console.log(err));
};
