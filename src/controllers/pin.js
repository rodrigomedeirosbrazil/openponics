const pinService = require('../services/pin');

const on = async function (req, res) {
  try {
    const { pin } = req.params;

    await pinService.setState(pin, true);

    return res.json({message: 'Pin ON'});
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
    const { pin } = req.params;

    await pinService.setState(pin, false);

    return res.json({ message: 'Pin OFF' });
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
    const { pin } = req.params;

    const pinDb = await pinService.getState(pin);

    const message = pinDb.state ? 'Pin ON' : 'Pin OFF'
    return res.json({ message, state: pinDb.state });
  } catch (error) {
    console.log(error)
    if (error.code == 'PIN_STATE_NOT_FOUND') {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

const pump = async function (req, res) {
  try {
    const { pin } = req.params;
    const { milliliters } = req.body;

    await pinService.pump(pin, milliliters);

    return res.json({ message: 'Pump OK' });
  } catch (error) {
    console.log(error)
    if (error.code == 'PIN_NOT_FOUND') {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  on, off, getState, pump
};
