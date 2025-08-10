/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('payments', function(table) {
        table.increments('payment_id').primary();
        table.integer('reservation_id').unsigned().notNullable();
        table.foreign('reservation_id').references('reservation_id').inTable('reservations');
        table.decimal('amount', 10, 2).notNullable();
        table.string('payment_method').notNullable();
        table.string('payment_status').notNullable().defaultTo('pending');
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('payments')
};
