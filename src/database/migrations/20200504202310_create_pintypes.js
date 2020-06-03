exports.up = function(knex) {
  knex.schema.createTable('pintypes', function (table) {
    table.integer('id').notNullable().primary().unique();
    table.string('name').notNullable();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('pintypes').then();
};
