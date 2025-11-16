const pool = require('../config/database');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', v.id,
                 'vendor_name', v.vendor_name,
                 'price', v.price,
                 'weight', v.weight,
                 'package_size', v.package_size,
                 'is_default', v.is_default
               )
             ) as vendors
      FROM products p
      LEFT JOIN vendors v ON p.id = v.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    // Parse the JSON string to object
    const parsedProducts = products.map((product) => ({
      ...product,
      vendors: JSON.parse(product.vendors),
    }));

    res.json({
      success: true,
      data: parsedProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const [vendors] = await pool.query(
      'SELECT * FROM vendors WHERE product_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...products[0],
        vendors,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { name, description, vendors } = req.body;

    // Validation
    if (!name || !vendors || vendors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product name and at least one vendor are required',
      });
    }

    await connection.beginTransaction();

    // Insert product
    const [productResult] = await connection.query(
      'INSERT INTO products (name, description) VALUES (?, ?)',
      [name, description || '']
    );

    const productId = productResult.insertId;

    // Insert vendors
    for (const vendor of vendors) {
      await connection.query(
        `INSERT INTO vendors 
         (product_id, vendor_name, price, weight, package_size, is_default) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          productId,
          vendor.vendor_name,
          vendor.price,
          vendor.weight,
          vendor.package_size,
          vendor.is_default || false,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      data: {
        id: productId,
        name,
        description,
        vendors,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// Update product
const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { name, description, vendors } = req.body;

    // Check if product exists
    const [products] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    await connection.beginTransaction();

    // Update product
    await connection.query(
      'UPDATE products SET name = ?, description = ? WHERE id = ?',
      [name, description || '', id]
    );

    // Delete existing vendors
    await connection.query('DELETE FROM vendors WHERE product_id = ?', [id]);

    // Insert new vendors
    for (const vendor of vendors) {
      await connection.query(
        `INSERT INTO vendors 
         (product_id, vendor_name, price, weight, package_size, is_default) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          vendor.vendor_name,
          vendor.price,
          vendor.weight,
          vendor.package_size,
          vendor.is_default || false,
        ]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      data: {
        id,
        name,
        description,
        vendors,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Delete product (vendors will be deleted by CASCADE)
    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
