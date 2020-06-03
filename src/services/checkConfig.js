const api = require('./services/api');
const db = require('../database/connection')
const upsert = require('../database/upsert')

const checkConfig = async () => {
  const pin = await db('pins').first()
  if (pin) return

  try {
    console.log('Getting Box configurations...')
    const res = await api.get(
      '/boxes/endpoint',
      { params: { key: process.env.BOX_ID } }
    );

    if (res.status === 200) {
      // console.log(res.data);
      await setPinTypes(res.data.pin_types);
      await setPins(res.data.pins);
    }

  } catch (error) {
    console.log('erro', error);
  }
}

const setPinTypes = async pinTypes => {
  pinTypes.map( async pinType => {
    await upsert('pintypes', { key: 'id' }, { id: pinType.id, name: pinType.name })
  })
}

const setPins = async pins => {
  pins.map(async pin => {
    await upsert('pins', { key: 'pin' }, { pin: pin.pin, name: pin.name, pintype_id: pin.pintype_id, state: false })
  })
}

module.export = checkConfig
