/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('reservation_passengers', function(table) {
        table.increments('id').primary();
        table.integer('reservation_id').unsigned().notNullable();
        table.foreign('reservation_id').references('reservation_id').inTable('reservations');
        table.string('passenger_name').notNullable();
        table.string('phone').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('reservation_passengers');
};
