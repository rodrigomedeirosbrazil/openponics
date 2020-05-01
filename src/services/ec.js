const Serial = require('raspi-serial').Serial;

const raspiInit = require('../utils/raspiInit');

const DELIMITER = Buffer.from('\r\n');
const SERIAL_OPTIONS = {
  portId: '/dev/serial0',
  baudRate: 300
}

module.exports = async () => {
  await raspiInit()
  const serial = new Serial(SERIAL_OPTIONS)
  await openSerial(serial)
  const timeout = setTimeout( () => {
    throw new Error('Serial timeout');
  }, 5000)
  const data = await readLine(serial)
  await closeSerial(serial)
  clearTimeout(timeout);
  return data;
}

const readLine = async serial => {
  let buffer = Buffer.alloc(0)
  let chunk
  let chunks =0
  while (chunks++ < 5) {
    chunk = await readSerial(serial)
    buffer = Buffer.concat([buffer, chunk])
    let position
    let position2
    if ((position = buffer.indexOf(DELIMITER)) !== -1 && (position2 = buffer.indexOf(DELIMITER, position + DELIMITER.length)) !== -1) {
      const line = buffer.slice(position + DELIMITER.length, position2)
      buffer = buffer.slice(position2 + DELIMITER.length)
      return line.toString()
    }
  }
  return ''
}

const openSerial = serial => {
  return new Promise((resolve, reject) => {
    try {
      serial.open(() => {
        // console.log('Serial openned.')
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
        // console.log('Serial closed.')
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
        // console.log('Data received: ', data.toString())
        resolve(data);
      });
    } catch (err) {
      reject(new Error('Failed to read serial', err));
    }
  })
}
