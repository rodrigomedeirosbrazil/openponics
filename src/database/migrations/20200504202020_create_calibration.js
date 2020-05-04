exports.up = function(knex) {
  knex.schema.createTable('calibrations', function (table) {
    table.string('key').notNullable().unique();
    table.decimal('value').notNullable();
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('calibrations').then();
};
