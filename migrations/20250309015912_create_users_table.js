exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      // primary Key
      table.increments('id').primary();
  
      // unique username
      table.string('username').notNullable().unique();
  
      // user profile fields
      table.string('name');
      table.string('bio');
      table.string('location');
  
      // public repos, followers, following - default to 0
      table.integer('public_repos').notNullable().defaultTo(0);
      table.integer('followers').notNullable().defaultTo(0);
      table.integer('following').notNullable().defaultTo(0);
  
      // languages array
      table.specificType('languages', 'text[]');
  
      // git profile URL - required
      table.string('html_url').notNullable();
  
      // timestamps for created_at and updated_at
      table.timestamps(true, true);
    })
    .then(() => {
      // index to optimize searches by location (ignores null values)
      return knex.schema
        .raw('CREATE INDEX idx_users_location ON users(location) WHERE location IS NOT NULL')
  
        // GIN (Generalized Inverted Index) optimize searches in languages array
        .raw('CREATE INDEX idx_users_languages ON users USING gin(languages)');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('users');
  };
  