const api = require('../services/api');
const db = require('../database/connection')
const upsert = require('../database/upsert')

const checkConfig = async () => {
  const pins = await db('pins').first()
  if (pins) return

  try {
    console.log('Getting Box configurations...')
    const res = await api.get(
      '/boxes/endpoint',
      { params: { key: process.env.BOX_KEY } }
    );

    if (res.status === 200) {
      await setPinTypes(res.data.pintypes);
      await setPins(res.data.pins);
    }

  } catch (error) {
    console.log('erro', error);
  }
}

const setPinTypes = async pinTypes => {
  pinTypes.map( async pinType => {
    await upsert('pintypes', { id: pinType.id }, { name: pinType.name })
  })
}

const setPins = async pins => {
  pins.map(async pin => {
    await upsert('pins', { pin: pin.pin }, { name: pin.name, pintype_id: pin.pintype_id, state: false })
  })
}

module.exports = checkConfig;
