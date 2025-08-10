/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('payments', function(table) {
      table.text('payment_status').defaultTo('pendente').alter();
    });
  
    await knex.raw(`
      ALTER TABLE payments 
      ADD CONSTRAINT payment_status_check 
      CHECK (payment_status IN ('pendente', 'confirmado', 'falhou'));
    `);
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`ALTER TABLE payments DROP CONSTRAINT IF EXISTS payment_status_check`);
  
    await knex.schema.alterTable('payments', function(table) {
      table.string('payment_status').defaultTo('pending').alter();
    });
  };
