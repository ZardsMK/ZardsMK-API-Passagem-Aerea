/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
        return knex.schema.createTable('flights', function(table) {
          table.increments('flight_id').primary();
          table.integer('airline_id').unsigned().notNullable();
          table.foreign('airline_id').references('airline_id').inTable('airlines');
          table.string('origin').notNullable();
          table.string('destination').notNullable();
          table.datetime('departure_time').notNullable();
          table.datetime('arrival_time').notNullable();
          table.integer('available_seats').notNullable().defaultTo(0);
        });
};
/**
  * @param { import("knex").Knex } knex
  * @returns { Promise<void> }
  */
exports.down = function(knex) {
    return knex.schema.dropTable('flights')
  };