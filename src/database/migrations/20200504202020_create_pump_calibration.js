exports.up = function(knex) {
  knex.schema.createTable('pump_calibrations', function (table) {
    table.string('pin').primary().notNullable().unique();
    table.integer('value').notNullable();
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('pump_calibrations').then();
};
