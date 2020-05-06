const relayService = require('./relay');
const delay = require('../utils/delay');
const CustomError = require('../utils/CustomError');
const db = require('../database/connection')

const pumpGpio = {
  1: process.env.PUMP_1_PIN || 'P1-35',
  2: process.env.PUMP_2_PIN || 'P1-33',
  3: process.env.PUMP_3_PIN || 'P1-31',
  4: process.env.PUMP_4_PIN || 'P1-29',
  5: process.env.PUMP_5_PIN || 'P1-27',
}

const work = async (number, milliliters) => {
  const calibration = await db('calibrations').where('key', 'pump').first()
  if (!calibration) throw new CustomError('Need to calibrate pumps', 'PUMP_CALIBRATE');

  const millilitersPerSecond = calibration.value;
  const miliseconds = (milliliters / millilitersPerSecond) * 1000
  await pulse(number, miliseconds)
};

const pulse = async (number, miliseconds) => {
  const pin = pumpGpio[number]
  if (!pin) throw new CustomError('Pump pin not found', 'PIN_NOT_FOUND');

  await relayService.on(pin);
  await delay(miliseconds);
  await relayService.off(pin);
};

const calibrate = async millilitersPerSecond => {
  await db('calibrations').insert({ key: 'pump', value: millilitersPerSecond })
    .catch(async error => {
      if (error.code == 'SQLITE_CONSTRAINT') {
        await db('calibrations').where('key', 'pump').update({ value: millilitersPerSecond })
      }
    })
};

module.exports = { pulse, work, calibrate }
