/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const hasReservedAt = await knex.schema.hasColumn('reservations', 'reserved_at');
    const hasExpiresAt = await knex.schema.hasColumn('reservations', 'expires_at');
    const hasTotalAmount = await knex.schema.hasColumn('reservations', 'total_amount');
    const hasUserId = await knex.schema.hasColumn('reservations', 'user_id');
  
    await knex.schema.alterTable('reservations', (table) => {
      if (!hasReservedAt) {
        table.timestamp('reserved_at').defaultTo(knex.fn.now());
      }
      if (!hasExpiresAt) {
        table.timestamp('expires_at').nullable();
      }
      if (!hasTotalAmount) {
        table.decimal('total_amount', 10, 2).nullable();
      }
      if (!hasUserId) {
        table.uuid('user_id').nullable();
      }
    });
  
    await knex.raw(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.table_constraints
          WHERE constraint_name = 'reservations_user_id_foreign'
            AND table_name = 'reservations'
        ) THEN
          ALTER TABLE reservations DROP CONSTRAINT reservations_user_id_foreign;
        END IF;
      END
      $$;
    `);
  
    await knex.schema.alterTable('reservations', (table) => {
      table.foreign('user_id').references('users.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('reservations', (table) => {
        table.dropForeign('user_id');
        table.dropColumn('user_id');
        table.dropColumn('reserved_at');
        table.dropColumn('expires_at');
        table.dropColumn('total_amount');
      });
};
