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

const getstate = async (pin) => {
  await raspiInit();

  const input = new gpio.DigitalInput({
    pin: pin,
    pullResistor: gpio.PULL_NONE
  });

  return input.read()
}

module.exports = { on, off, getstate }
