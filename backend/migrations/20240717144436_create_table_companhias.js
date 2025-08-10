/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('airlines', function(table) {
      table.increments('airline_id').primary();
      table.string('name').notNullable();
      table.string('logo_url');
    });
  };  
/**
  * @param { import("knex").Knex } knex
  * @returns { Promise<void> }
  */
exports.down = function(knex) {
  return knex.schema.dropTable('airlines')
};