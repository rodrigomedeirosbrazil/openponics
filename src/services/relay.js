const gpio = require('raspi-gpio');

const raspiInit = require('../utils/raspiInit');

const on = async (pin) => {
  await raspiInit();

  const output = new gpio.DigitalOutput(pin);
  output.write(gpio.HIGH);
}

const off = async (pin) => {
  await raspiInit();

  const output = new gpio.DigitalOutput(pin);
  output.write(gpio.LOW);
}

module.exports = { on, off }
