/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('seats', function(table) {
        table.increments('seat_id').primary();
        table.integer('flight_id').unsigned().notNullable();
        table.foreign('flight_id').references('flight_id').inTable('flights');
        table.string('seat_number').notNullable();
        table.enum('status', ['livre', 'reservado', 'comprado', 'indisponível']).defaultTo('livre');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('seats');
};
