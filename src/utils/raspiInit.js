const Raspi = require('raspi');

module.exports = () => {
  return new Promise((resolve) => {
    try {
      Raspi.init(() => {
        resolve();
      });
    } catch(err) {
      reject(new Error('Failed to init Raspi lib', err));
    }
  })
}
