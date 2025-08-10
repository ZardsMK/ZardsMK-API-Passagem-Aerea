/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('reservations', function(table) {
        table.integer('user_id').notNullable().alter();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.alterTable('reservations', function(table) {
        table.integer('user_id').nullable().alter();
      });
};
