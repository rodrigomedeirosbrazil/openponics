const relayService = require('../services/relay');
const delay = require('../utils/delay');

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

const pulse = async function (req, res) {
  try {
    const { number } = req.params;
    const { miliseconds } = req.body;

    //TODO: set min max to number and miliseconds
    const pin = pumpGpio[number]

    if (!pin) return res.status(400).json({ message: 'Pump pin not found' });

    await relayService.on(pin);
    await delay(miliseconds);
    await relayService.off(pin);

    return res.json({message: 'Pulse OK'});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  pulse
};
