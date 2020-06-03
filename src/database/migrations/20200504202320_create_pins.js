exports.up = function(knex) {
  knex.schema.createTable('pins', function (table) {
    table.string('pin').primary().unique();
    table.string('name');
    table.boolean('state').notNullable();
    table.timestamps();

    table.integer('pintype_id')
      .notNullable()
      .references('id')
      .inTable('pintypes');

  }).then();
};

exports.down = function(knex) {
  knex.schema.dropTable('pins').then();
};
