const endpoints = require('../db/utils/endpoints.json');

exports.GetEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
