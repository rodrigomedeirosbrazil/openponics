const db = require('./connection')

module.exports = async (table, where, values) => {
  await db(table).insert({ ...where, ...values })
    .catch(async error => {
      if (error.code == 'SQLITE_CONSTRAINT') {
        await db(table).where(where).update(values)
      }
    })
}
