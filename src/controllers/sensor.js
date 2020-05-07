const phService = require('../services/ph');
const ecService = require('../services/ec');

const ph = async function (req, res) {
  try {
    const readPh = await phService.readPh();
    return res.json({ ph: readPh });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const phCalibrate = async function (req, res) {
  try {
    const { phDifference } = req.body;
    await phService.setCalibration(phDifference);
    return res.json({ message: 'PH calibration OK!' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const ec = async function (req, res) {
  try {
    const readEc = await ecService.readEc();
    return res.json({ ec: readEc.electricCondutivity });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const waterTemperature = async function (req, res) {
  try {
    const readEc = await ecService.readEc();
    return res.json({ ec: readEc.waterTemperature });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const ecCalibrate = async function (req, res) {
  try {
    const { ecDifference } = req.body;
    await ecService.setCalibration(ecDifference);
    return res.json({ message: 'EC calibration OK!' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ph, phCalibrate, ec, ecCalibrate, waterTemperature
};
