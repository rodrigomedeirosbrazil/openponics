exports.up = function(knex) {
  knex.schema.createTable('relays', function (table) {
    table.integer('id').notNullable().unique();
    table.boolean('state').notNullable();
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('relays').then();
};
