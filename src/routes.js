const { Router } = require('express');
const routes = Router();

const auth = require('./controllers/auth');
const sensor = require('./controllers/sensor');
const pin = require('./controllers/pin');

const logToConsole = (req, res, next) => {
  console.log(req.method + ' ' + req.url)
  return next();
};

routes.post('/auth/login', logToConsole, auth.login);
routes.post('/auth/changePassword', logToConsole, auth.verifyJwt, auth.changePassword);

routes.get('/sensor/ph', logToConsole, auth.verifyJwt, sensor.ph);
routes.post('/sensor/ph/calibrate', logToConsole, auth.verifyJwt, sensor.phCalibrate);
routes.get('/sensor/ec', logToConsole, auth.verifyJwt, sensor.ec);
routes.post('/sensor/ec/calibrate', logToConsole, auth.verifyJwt, sensor.ecCalibrate);
routes.get('/sensor/waterTemperature', logToConsole, auth.verifyJwt, sensor.waterTemperature);

routes.post('/pin/on/:pin', logToConsole, auth.verifyJwt, pin.on);
routes.post('/pin/off/:pin', logToConsole, auth.verifyJwt, pin.off);
routes.post('/pin/pump/:pin', logToConsole, auth.verifyJwt, pin.pump);
routes.get('/pin/:pin', logToConsole, auth.verifyJwt, pin.getState);

module.exports = routes;
