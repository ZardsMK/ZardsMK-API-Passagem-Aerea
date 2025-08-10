/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('reservation_seats', function(table) {
        table.increments('id').primary();
        table.integer('reservation_id').unsigned().notNullable();
        table.foreign('reservation_id').references('reservation_id').inTable('reservations');
        table.integer('seat_id').unsigned().notNullable();
        table.foreign('seat_id').references('seat_id').inTable('seats');
        table.integer('passenger_id').unsigned().notNullable();
        table.foreign('passenger_id').references('id').inTable('reservation_passengers');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('reservation_seats');
};
