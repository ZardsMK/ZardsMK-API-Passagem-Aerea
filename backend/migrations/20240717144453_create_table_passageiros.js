/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('passengers', function(table) {
      table.integer('passenger_id').unsigned().notNullable();
      table.foreign('passenger_id').references('id').inTable('users');
      table.string('passenger_name');
      table.string('phone');
    });
  };
/**
  * @param { import("knex").Knex } knex
  * @returns { Promise<void> }
 */
  exports.down = function(knex) {
    return knex.schema.dropTable('passengers')
  };