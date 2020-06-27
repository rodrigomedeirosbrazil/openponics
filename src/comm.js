require('dotenv').config()

const api = require('./services/api')
const db = require('./database/connection')
const pinService = require('./services/pin');

const worker = async () => {
  console.log('Getting data...');
  const pins = await db('pins').select('*')
  const sensors = await db('sensorlogs').orderBy('updated_at', 'desc').select('*').first()

  const sendData = {
    key: process.env.BOX_KEY,
    pins,
    sensors
  }

  try {
    console.log('Connecting to ' + process.env.API_URL);
    const res = await api.post(
      '/boxes/endpoint',
      sendData
    );

    if (res.status === 200) {
      console.log(res.data);
      commandProcessor(res.data.commands);
    }

  } catch (error) {
    console.log('erro', error);
  }
}

const commandsStrategy = {
  pin_on: pinService.turnOn,
  pin_off: pinService.turnOff,
  pump: pinService.pump,
}

const commandProcessor = commands => {
  commands.map( command => {
    commandsStrategy[command.command](...command.params);
  });
}

worker();
