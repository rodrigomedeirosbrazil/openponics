exports.up = function(knex) {
  knex.schema.createTable('ec_calibrations', function (table) {
    table.integer('ec').notNullable().primary().unique();
    table.integer('value').notNullable();
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('ec_calibrations').then();
};
