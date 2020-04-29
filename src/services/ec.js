const Serial = require('raspi-serial').Serial;

const raspiInit = require('../utils/raspiInit');

module.exports = async () => {
  await raspiInit()
  const serial = new Serial()
  await openSerial(serial)
  const data = await readSerial(serial)
  await closeSerial(serial)
  return data;
}

const openSerial = serial => {
  return new Promise((resolve, reject) => {
    try {
      serial.open(() => {
        resolve();
      });
    } catch (err) {
      reject(new Error('Failed to open serial', err));
    }
  })
}

const closeSerial = serial => {
  return new Promise((resolve, reject) => {
    try {
      serial.close(() => {
        resolve();
      });
    } catch (err) {
      reject(new Error('Failed to close serial', err));
    }
  })
}

const readSerial = serial => {
  return new Promise((resolve, reject) => {
    try {
      serial.on('data', (data) => {
        resolve(data);
      });
    } catch (err) {
      reject(new Error('Failed to read serial', err));
    }
  })
}
