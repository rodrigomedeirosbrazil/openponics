const db = require('./connection')

module.exports = async (table, where, values) => {
  const updated = await db(table).where(where).update(values).limit(1)
  if (updated === 0 ) {
    await db(table).insert({ ...where, ...values })
  }

}
