const raspiInit = require('../utils/raspiInit');
const I2C = require('raspi-i2c').I2C;
const ADS1x15 = require('raspi-kit-ads1x15');

module.exports = async () => {
  await raspiInit();
  const i2c = new I2C();
  const adc = getAdc(i2c);
  return await readChannel(adc);
}

const readChannel = adc => {
  return new Promise( (resolve, reject) => {
    // Get a single-ended reading from channel-0 and display the results
    adc.readChannel(ADS1x15.channel.CHANNEL_0, (err, value, volts) => {
      if (err) reject(new Error('Failed to fetch value from ADC', err));
      resolve({ value, volts })
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
