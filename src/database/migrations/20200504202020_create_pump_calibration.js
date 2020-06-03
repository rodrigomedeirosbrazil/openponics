exports.up = function(knex) {
  knex.schema.createTable('pump_calibrations', function (table) {
    table.decimal('pin').primary().notNullable().unique();
    table.decimal('value').notNullable();
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('pump_calibrations').then();
};
