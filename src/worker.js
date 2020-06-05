require('dotenv').config()

const api = require('./services/api')
const db = require('./database/connection')

console.log('Connecting to ' + process.env.API_URL);

const worker = async () => {
  const pins = await db('pins').select('*')
  const sensors = await db('sensorlogs').orderBy('updated_at', 'desc').select('*').first()

  const sendData = {
    key: process.env.BOX_KEY,
    pins,
    sensors
  }

  try {
    const res = await api.post(
      '/boxes/endpoint',
      sendData
    );

    if (res.status === 200) {
      console.log(res.data);
    }

  } catch (error) {
    console.log('erro', error);
  }
}

worker();
