const { Router } = require('express');
const routes = Router();

const auth = require('./controllers/auth');
const sensor = require('./controllers/sensor');
const pump = require('./controllers/pump');
const relay = require('./controllers/relay');

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

routes.post('/pump/calibrate', logToConsole, auth.verifyJwt, pump.calibrate);
routes.post('/pump/pulse/:number', logToConsole, auth.verifyJwt, pump.pulse);
routes.post('/pump/:number', logToConsole, auth.verifyJwt, pump.work);

routes.post('/relay/on/:number', logToConsole, auth.verifyJwt, relay.on);
routes.post('/relay/off/:number', logToConsole, auth.verifyJwt, relay.off);
routes.get('/relay/:number', logToConsole, auth.verifyJwt, relay.getState);


module.exports = routes;
