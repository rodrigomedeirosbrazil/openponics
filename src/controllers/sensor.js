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
    const readEc = await ecService();
    return res.json({ ec: readEc });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ph, phCalibrate, ec
};
