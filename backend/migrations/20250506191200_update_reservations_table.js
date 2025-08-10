/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('reservations', function(table) {
        table.dropColumns('passenger_id', 'seat_number'); 
        table.integer('user_id').unsigned().notNullable(); 
        table.foreign('user_id').references('id').inTable('users');

        table.text('status').defaultTo('pendente').alter();

        table.timestamp('reserved_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at').nullable();
        table.decimal('total_amount', 10, 2).nullable();
    });

    await knex.raw(`
        ALTER TABLE reservations 
        ADD CONSTRAINT status_check 
        CHECK (status IN ('pendente', 'reservado', 'pago', 'expirado', 'cancelado'));
      `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`ALTER TABLE reservations DROP CONSTRAINT IF EXISTS status_check`);

    await knex.schema.alterTable('reservations', function(table) {
        table.dropColumns('user_id', 'reserved_at', 'expires_at', 'total_amount');
        table.string('seat_number').notNullable();
        table.integer('passenger_id').unsigned().notNullable();
        table.foreign('passenger_id').references('id').inTable('users');
    
        table.string('status').defaultTo('pending').alter(); // volta ao original
    });
};
