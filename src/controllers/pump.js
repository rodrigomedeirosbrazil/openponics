const pumpService = require('../services/pump');

const work = async function (req, res) {
  try {
    const { number } = req.params;
    const { milliliters } = req.body;

    await pumpService.work(number, milliliters);

    return res.json({ message: 'Work OK' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const pulse = async function (req, res) {
  try {
    const { number } = req.params;
    const { miliseconds } = req.body;

    await pumpService.pulse(number, miliseconds);

    return res.json({message: 'Pulse OK'});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const calibrate = async function (req, res) {
  try {
    const { millilitersPerSecond } = req.body;

    await pumpService.calibrate(millilitersPerSecond);

    return res.json({ message: 'Calibrate OK' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { work, pulse, calibrate };
