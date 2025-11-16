const pool = require('../config/database');

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const [recipes] = await pool.query(`
      SELECT r.*,
             (SELECT SUM(
               v.price * ri.quantity / v.weight
             )
             FROM recipe_ingredients ri
             JOIN vendors v ON ri.product_id = v.product_id AND v.is_default = 1
             WHERE ri.recipe_id = r.id
             ) as total_cost
      FROM recipes r
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const [recipes] = await pool.query(
      'SELECT * FROM recipes WHERE id = ?',
      [id]
    );

    if (recipes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found',
      });
    }

    const [ingredients] = await pool.query(
      `SELECT ri.*, p.name as product_name,
              v.price as unit_price, v.weight, v.package_size
       FROM recipe_ingredients ri
       JOIN products p ON ri.product_id = p.id
       LEFT JOIN vendors v ON p.id = v.product_id AND v.is_default = 1
       WHERE ri.recipe_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...recipes[0],
        ingredients,
      },
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new recipe
const createRecipe = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { name, description, ingredients } = req.body;

    // Validation
    if (!name || !ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Recipe name and at least one ingredient are required',
      });
    }

    await connection.beginTransaction();

    // Insert recipe
    const [recipeResult] = await connection.query(
      'INSERT INTO recipes (name, description) VALUES (?, ?)',
      [name, description || '']
    );

    const recipeId = recipeResult.insertId;

    // Insert ingredients
    for (const ingredient of ingredients) {
      await connection.query(
        `INSERT INTO recipe_ingredients 
         (recipe_id, product_id, quantity) 
         VALUES (?, ?, ?)`,
        [recipeId, ingredient.product_id, ingredient.quantity]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      data: {
        id: recipeId,
        name,
        description,
        ingredients,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating recipe:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { name, description, ingredients } = req.body;

    // Check if recipe exists
    const [recipes] = await connection.query(
      'SELECT * FROM recipes WHERE id = ?',
      [id]
    );

    if (recipes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found',
      });
    }

    await connection.beginTransaction();

    // Update recipe
    await connection.query(
      'UPDATE recipes SET name = ?, description = ? WHERE id = ?',
      [name, description || '', id]
    );

    // Delete existing ingredients
    await connection.query(
      'DELETE FROM recipe_ingredients WHERE recipe_id = ?',
      [id]
    );

    // Insert new ingredients
    for (const ingredient of ingredients) {
      await connection.query(
        `INSERT INTO recipe_ingredients 
         (recipe_id, product_id, quantity) 
         VALUES (?, ?, ?)`,
        [id, ingredient.product_id, ingredient.quantity]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      data: {
        id,
        name,
        description,
        ingredients,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating recipe:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if recipe exists
    const [recipes] = await pool.query(
      'SELECT * FROM recipes WHERE id = ?',
      [id]
    );

    if (recipes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found',
      });
    }

    // Delete recipe (ingredients will be deleted by CASCADE)
    await pool.query('DELETE FROM recipes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
