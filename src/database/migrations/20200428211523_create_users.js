exports.up = function(knex) {
  knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.timestamps();
  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('users').then();
};
