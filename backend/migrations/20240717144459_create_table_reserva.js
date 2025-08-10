/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('reservations', function(table) {
        table.increments('reservation_id').primary();
        table.integer('passenger_id').unsigned().notNullable();
        table.foreign('passenger_id').references('id').inTable('users');
        table.integer('flight_id').unsigned().notNullable();
        table.foreign('flight_id').references('flight_id').inTable('flights');
        table.string('seat_number').notNullable();
        table.string('status').notNullable().defaultTo('pending');
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('reservations')
};
