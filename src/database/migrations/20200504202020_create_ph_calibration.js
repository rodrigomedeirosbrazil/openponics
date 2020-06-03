exports.up = function(knex) {
  knex.schema.createTable('ph_calibrations', function (table) {
    table.decimal('ph', 4, 2).notNullable().primary().unique();
    table.decimal('value', 4, 2).notNullable();
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('ph_calibrations').then();
};
