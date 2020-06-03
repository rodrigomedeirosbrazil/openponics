exports.up = function(knex) {
  knex.schema.createTable('sensorlogs', function (table) {
    table.integer('id').notNullable().unique();
    table.decimal('ph', 4, 2);
    table.integer('ec');
    table.integer('water_temp');
    table.integer('air_temp');
    table.integer('air_humidity');
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('sensorlogs').then();
};
