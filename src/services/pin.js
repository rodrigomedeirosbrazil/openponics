const gpio = require('raspi-gpio');

const raspiInit = require('../utils/raspiInit');
const db = require('../database/connection')
const upsert = require('../database/upsert')
const CustomError = require('../utils/CustomError');
const delay = require('../utils/delay');

const setState = async (pin, state) => {
  await raspiInit();

  const dbPin = db('pins').where('pin', pin).first()
  if (!dbPin) throw new CustomError('Pin not set', 'PIN_NOT_SET');

  const output = new gpio.DigitalOutput(pin);
  output.write(state ? gpio.HIGH : gpio.LOW);

  await upsert('pins', { pin }, { state })
}

const getState = async pin => {
  const dbPin = await db('pins').where('pin', pin).first()
  if (!dbPin) throw new CustomError('Pin not set', 'PIN_NOT_SET');
  return dbPin
}

const pump = async (pin, milliliters) => {
  // const dbPin = await db('pins').where('pin', pin).first()
  // if (!dbPin) throw new CustomError('Pin not set', 'PIN_NOT_SET');
  // if (dbPin.pintype !== 'PUMP') throw new CustomError('Pin is not a pump', 'PIN_NOT_PUMP');

  const calibration = await db('pump_calibrations').where('pin', pin).first()
  if (!calibration) throw new CustomError('Need to calibrate pump', 'PUMP_CALIBRATE');

  const millilitersPerSecond = calibration.value;
  const miliseconds = (milliliters / millilitersPerSecond) * 1000
  await setState(pin, true);
  await delay(miliseconds);
  await setState(pin, false);
};

module.exports = { setState, getState, pump }
