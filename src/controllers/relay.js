const relayService = require('../services/relay');
const db = require('../database/connection')

const relayGpio = {
  // 1: 'P1-35', // Pump 1 - pin 35
  // 2: 'P1-33', // Pump 2 - pin 33
  // 3: 'P1-31', // Pump 3 - pin 31
  // 4: 'P1-29', // Pump 4 - pin 29
  // 5: 'P1-27', // Pump 5 - pin 27
  1: 'P1-23', // Relay 1 - pin 23
  2: 'P1-21', // Relay 2 - pin 21
  3: 'P1-19', // Relay 3 - pin 19
}

const on = async function (req, res) {
  try {
    const { number } = req.params;

    const pin = relayGpio[number]

    if (!pin) return res.status(400).json({ message: 'Relay pin not found' });

    await relayService.on(pin);

    await db('relays').insert({ id: number, state: true})
      .catch(async error => {
        if (error.code == 'SQLITE_CONSTRAINT') {
          await db('relays').where('id', number).update({ state: true })
        }
      })

    return res.json({message: 'Relay ON'});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const off = async function (req, res) {
  try {
    const { number } = req.params;

    //TODO: set min max to number and miliseconds
    const pin = relayGpio[number]

    if (!pin) return res.status(400).json({ message: 'Relay pin not found' });

    await relayService.off(pin);

    await db('relays').insert({ id: number, state: false })
      .catch(async error => {
        if (error.code == 'SQLITE_CONSTRAINT') {
          await db('relays').where('id', number).update({ state: false })
        }
      })

    return res.json({ message: 'Relay OFF' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const getState = async function (req, res) {
  try {
    const { number } = req.params;

    const relay = await db('relays').where('id', number).first()
    if (!relay) return res.status(404).json({ message: "Relay state not found" });

    const message = relay.state ? 'Relay ON' : 'Relay OFF'
    return res.json({ message, state: relay.state });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  on, off, getState
};
