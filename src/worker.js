require('dotenv').config()

const db = require('./database/connection')

const phService = require('./services/ph')
const ecService = require('./services/ec')
// TODO: put humidity sensor and air temperature here!

const worker = () => {
  console.log('Reading sensors...')

  Promise.all([
    phService.readPh(),
    ecService.readEc()
  ])
  .then(([readPh, readEc]) => {
    console.log('Recording values...')
    db('sensorlogs')
      .insert({
        ph: readPh,
        ec: readEc.electricCondutivity,
        water_temp: readEc.waterTemperature
      });
  })
  .catch( error => {
    console.log('Error occurs when read sensors.', error)
  })
}

worker()
console.log('Exiting...')
