const phService = require('../services/ph');
const ecService = require('../services/ec');

const ph = async function (req, res) {
  try {
    const readPh = await phService();
    return res.json(readPh);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const ec = async function (req, res) {
  try {
    const readEc = await ecService();
    return res.json(readEc);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ph, ec
};
