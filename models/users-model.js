const connection = require('../db/connection');

console.log('usermodel');

exports.fetchUsers = () => connection.select('*').from('users');

exports.postUser = user => connection('users')
  .insert(user)
  .returning('*');

exports.fetchUserByID = username => connection('users')
  .where('username', '=', username)
  .returning('*');
