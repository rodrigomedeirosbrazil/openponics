const phService = require('../services/ph');

const ph = async function (req, res) {
  try {
    const readPh = await phService();
    return res.json(readPh);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  ph
};
