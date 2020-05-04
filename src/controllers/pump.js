const relayService = require('../services/relay');
const delay = require('../utils/delay');
const db = require('../database/connection')

const pumpGpio = {
  1: 'GPIO24', // Pump 1 - pin 35
  2: 'GPIO23', // Pump 2 - pin 33
  3: 'GPIO22', // Pump 3 - pin 31
  4: 'GPIO21', // Pump 4 - pin 29
  5: 'GPIO30', // Pump 5 - pin 27
  // 1: 'GPIO14', // Relay 1 - pin 23
  // 2: 'GPIO13', // Relay 2 - pin 21
  // 3: 'GPIO12', // Relay 3 - pin 19
}

const work = async function (req, res) {
  try {
    const { number } = req.params;
    const { milliliters } = req.body;

    //TODO: set min max to number and miliseconds
    const pin = pumpGpio[number]

    if (!pin) return res.status(400).json({ message: 'Pump pin not found' });

    const calibration = await db('calibrations').where('key', 'pump').first()
    if (!calibration) return res.status(404).json({ message: "Need to calibrate pumps" });

    const millilitersPerSecond = calibration.value;
    const miliseconds = (milliliters / millilitersPerSecond) * 1000

    await handlePulse(pin, miliseconds)

    return res.json({ message: 'Pulse OK' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const pulse = async function (req, res) {
  try {
    const { number } = req.params;
    const { miliseconds } = req.body;

    //TODO: set min max to number and miliseconds
    const pin = pumpGpio[number]

    if (!pin) return res.status(400).json({ message: 'Pump pin not found' });

    await handlePulse(pin, miliseconds)

    return res.json({message: 'Pulse OK'});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const calibrate = async function (req, res) {
  try {
    const { millilitersPerSecond } = req.body;

    await db('calibrations').insert({ key: 'pump', value: millilitersPerSecond })
    .catch( async error => {
      if (error.code == 'SQLITE_CONSTRAINT') {
        await db('calibrations').where('key', 'pump').update({ value: millilitersPerSecond })
      } else {
        throw error
      }
    })

    return res.json({ message: 'Calibrate OK' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const handlePulse = async (pin, miliseconds) => {
  await relayService.on(pin);
  await delay(miliseconds);
  await relayService.off(pin);
};

module.exports = { work, pulse, calibrate };
