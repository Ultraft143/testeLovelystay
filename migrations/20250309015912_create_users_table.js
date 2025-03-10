exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary(); // Auto-incrementing ID
        table.string('username').notNullable();
        table.string('name');
        table.string('bio');
        table.string('location');
        table.integer('public_repos').notNullable();
        table.specificType('languages', 'text[]');
        table.integer('followers').notNullable();
        table.integer('following').notNullable();
        table.string('html_url').notNullable();
        table.timestamps(true, true); // created_at and updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
