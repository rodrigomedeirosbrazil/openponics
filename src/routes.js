const { Router } = require('express');
const routes = Router();

const auth = require('./controllers/auth');
// const sensor = require('./controllers/sensor');

const logToConsole = (req, res, next) => {
  console.log(req.method + ' ' + req.url)
  return next();
};

routes.post('/auth/login', logToConsole, auth.login);
routes.post('/auth/changePassword', logToConsole, auth.verifyJwt, auth.changePassword);

// routes.get('/sensor/ph', logToConsole, auth.verifyJwt, sensor.ph);
// routes.get('/sensor/ec', logToConsole, auth.verifyJwt, sensor.ec);

module.exports = routes;
