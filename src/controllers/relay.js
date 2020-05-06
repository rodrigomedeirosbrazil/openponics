const relayService = require('../services/relay');

const on = async function (req, res) {
  try {
    const { number } = req.params;

    await relayService.setState(number, true);

    return res.json({message: 'Relay ON'});
  } catch (error) {
    console.log(error)
    if (error.code == 'PIN_NOT_FOUND') {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

const off = async function (req, res) {
  try {
    const { number } = req.params;

    await relayService.setState(number, false);

    return res.json({ message: 'Relay OFF' });
  } catch (error) {
    console.log(error)
    if (error.code == 'PIN_NOT_FOUND') {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

const getState = async function (req, res) {
  try {
    const { number } = req.params;

    const relay = await relayService.getState(number);

    const message = relay.state ? 'Relay ON' : 'Relay OFF'
    return res.json({ message, state: relay.state });
  } catch (error) {
    console.log(error)
    if (error.code == 'RELAY_STATE_NOT_FOUND') {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  on, off, getState
};
