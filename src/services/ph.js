const I2C = require('raspi-i2c').I2C;
const ADS1x15 = require('raspi-kit-ads1x15');

const raspiInit = require('../utils/raspiInit');
const delay = require('../utils/delay');
const db = require('../database/connection')
const upsert = require('../database/upsert')

const readPh = async () => {
  await raspiInit();
  const i2c = new I2C();
  const adc = getAdc(i2c);
  const reads = [];

  for (let i = 0; i < 10; i++) {
    reads.push(await readChannel(adc));
    await delay(30);
  }

  const avgValue = average(reads);
  const calibration = await db('calibrations').where('key', 'ph').first()

  const phCalibration = calibration ? calibration.value : 0

  const pHVol = avgValue * 5.0 / 1024 / 6;
  return -5.70 * pHVol + phCalibration;
}

const setCalibration = async phDifference => {
  await upsert('calibrations', { key: 'ph'}, { value: phDifference })
}

const readChannel = adc => {
  return new Promise( (resolve, reject) => {
    // Get a single-ended reading from channel-0 and display the results
    adc.readChannel(ADS1x15.channel.CHANNEL_0, (err, value, volts) => {
      if (err) reject(new Error('Failed to fetch value from ADC', err));
      resolve(volts)
    });
  });
}

const getAdc = i2c => {
  // Init the ADC
  return new ADS1x15({
    i2c,                                    // i2c interface
    chip: ADS1x15.chips.IC_ADS1015,         // chip model
    address: ADS1x15.address.ADDRESS_0x48,  // i2c address on the bus

    // Defaults for future readings
    pga: ADS1x15.pga.PGA_4_096V,            // power-gain-amplifier range
    sps: ADS1x15.spsADS1015.SPS_250         // data rate (samples per second)
  });
}

const average = ar => {
  ar.sort()
  ar.splice(0, 2) // remove lowers value
  ar.splice(-2, 2) // remove highers value
  return ar.reduce(function (a, b) {
    console.log(b)
    return a + b
  }, 0) / ar.length;
}

module.exports = { readPh, setCalibration }
