const gpio = require('raspi-gpio');

const raspiInit = require('../utils/raspiInit');
const db = require('../database/connection')
const CustomError = require('../utils/CustomError');

const relayGpio = {
  1: process.env.RELAY_1_PIN || 'P1-23',
  2: process.env.RELAY_1_PIN || 'P1-21',
  3: process.env.RELAY_1_PIN || 'P1-19',
}

const setState = async (number, state) => {
  await raspiInit();

  const pin = relayGpio[number]
  if (!pin) throw new CustomError('Relay pin not found', 'PIN_NOT_FOUND');

  const output = new gpio.DigitalOutput(pin);
  output.write(state ? gpio.HIGH : gpio.LOW);

  await db('relays').insert({ id: number, state: true })
    .catch(async error => {
      if (error.code == 'SQLITE_CONSTRAINT') {
        await db('relays').where('id', number).update({ state })
      }
    })
}

const getState = async number => {
  const relay = await db('relays').where('id', number).first()
  if (!relay) throw new CustomError('Relay state not found', 'RELAY_STATE_NOT_FOUND');
  return relay
}

module.exports = { setState, getState }
