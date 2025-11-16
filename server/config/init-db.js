const pool = require('./database');

const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create vendors table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        vendor_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        weight DECIMAL(10, 2) NOT NULL,
        package_size VARCHAR(10) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Create recipes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create recipe_ingredients table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        recipe_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Create index on recipe_id
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_recipe_id 
      ON recipe_ingredients(recipe_id)
    `);

    connection.release();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = initDatabase;
