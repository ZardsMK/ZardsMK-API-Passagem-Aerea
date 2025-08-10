/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('airports', function(table) {
        table.increments('airport_id').primary();
        table.string('name').notNullable();
        table.string('city').notNullable();
        table.string('country').notNullable();
        table.string('code').notNullable();
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('airports')
};
