# Tiffin Management System - Technical Documentation

## Project Overview

This is a complete Recipe and Ingredient Management desktop application that allows restaurant owners, chefs, and kitchen managers to:

- Manage ingredients (products) with multi-vendor pricing
- Create and manage recipes
- Automatically calculate recipe costs based on ingredient quantities
- Track vendor pricing for cost optimization

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | React / Next.js | 18 / 13 |
| Backend | Node.js / Express | - / 4.18 |
| Database | MySQL | 8.0 |
| Desktop | Electron | 28.0 |
| UI Framework | Material-UI | 5.x |

## Architecture

### Frontend (Next.js + React)
- **Pages**: Product Entry, Product Management, Recipe Creation, Recipe Management
- **Components**: Reusable UI components from Minimal template
- **Sections**: Page-specific components for products and recipes
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js file-based routing

### Backend (Express + MySQL)
- **API Server**: RESTful API on port 3001
- **Database**: MySQL with connection pooling
- **Controllers**: Business logic for products and recipes
- **Routes**: API endpoint definitions
- **Validation**: Server-side input validation

### Desktop (Electron)
- **Main Process**: Window management and app lifecycle
- **Renderer Process**: Next.js web app
- **IPC**: Secure communication via context bridge
- **Packaging**: electron-builder for distribution

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Vendors Table
```sql
CREATE TABLE vendors (
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
);
```

### Recipes Table
```sql
CREATE TABLE recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Recipe Ingredients Table
```sql
CREATE TABLE recipe_ingredients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipe_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

## API Reference

### Product Endpoints

#### GET /api/products
Returns all products with their vendors.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Flour",
      "description": "All-purpose flour",
      "vendors": [
        {
          "id": 1,
          "vendor_name": "Vendor A",
          "price": 5.99,
          "weight": 1000,
          "package_size": "g",
          "is_default": true
        }
      ]
    }
  ]
}
```

#### POST /api/products
Creates a new product with vendors.

**Request Body:**
```json
{
  "name": "Flour",
  "description": "All-purpose flour",
  "vendors": [
    {
      "vendor_name": "Vendor A",
      "price": 5.99,
      "weight": 1000,
      "package_size": "g",
      "is_default": true
    }
  ]
}
```

#### PUT /api/products/:id
Updates an existing product.

#### DELETE /api/products/:id
Deletes a product and its vendors.

### Recipe Endpoints

#### GET /api/recipes
Returns all recipes with total cost.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Chocolate Cake",
      "description": "Delicious chocolate cake",
      "total_cost": 12.50
    }
  ]
}
```

#### POST /api/recipes
Creates a new recipe with ingredients.

**Request Body:**
```json
{
  "name": "Chocolate Cake",
  "description": "Delicious chocolate cake",
  "ingredients": [
    {
      "product_id": 1,
      "quantity": 500
    }
  ]
}
```

## Features

### Product Management
1. **Multi-step Form**: Product info → Vendor details → Review
2. **Multi-vendor Support**: Up to 3 vendors per product
3. **Default Vendor**: One vendor marked as default for cost calculations
4. **Validation**: Client and server-side validation
5. **Search**: Real-time product search

### Recipe Management
1. **Ingredient Selection**: Choose from product database
2. **Quantity Input**: Specify exact quantities needed
3. **Auto Cost Calculation**: Real-time cost calculation
4. **Recipe CRUD**: Create, read, update, delete recipes
5. **Search**: Real-time recipe search

## Security

- **SQL Injection Prevention**: Parameterized queries
- **Context Isolation**: Electron security best practices
- **Input Validation**: Client and server validation
- **CORS**: Configured for local development
- **Environment Variables**: Secure credential storage

## Performance

- **Connection Pooling**: MySQL connection pooling
- **Lazy Loading**: Components loaded on demand
- **Optimized Queries**: Efficient SQL with joins
- **Indexes**: Database indexes on foreign keys

## Development Workflow

### Starting Development
```bash
npm run electron:dev
```

### Separate Services
```bash
npm run dev:server   # Backend on :3001
npm run dev:next     # Frontend on :3000
electron .           # Desktop app
```

### Building Production
```bash
npm run build        # Build Next.js
npm run package      # Package Electron app
npm run dist         # Create installers
```

## Error Handling

### Frontend
- Try-catch blocks around API calls
- User-friendly error messages
- Loading states during operations
- Confirmation dialogs for destructive actions

### Backend
- Centralized error handling middleware
- Consistent error response format
- Transaction rollback on failures
- Database constraint enforcement

## File Structure

```
tiffin-management-system/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Secure IPC bridge
├── server/
│   ├── config/
│   │   ├── database.js      # MySQL configuration
│   │   └── init-db.js       # Database initialization
│   ├── controllers/
│   │   ├── productController.js
│   │   └── recipeController.js
│   ├── routes/
│   │   ├── products.js
│   │   └── recipes.js
│   └── index.js             # Express server
├── src/
│   ├── pages/
│   │   └── dashboard/
│   │       ├── products/
│   │       │   ├── entry.js    # Product entry form
│   │       │   └── list.js     # Product list
│   │       └── recipes/
│   │           ├── creation.js # Recipe creation
│   │           └── list.js     # Recipe list
│   ├── sections/
│   │   └── @dashboard/
│   │       ├── product/        # Product components
│   │       └── recipe/         # Recipe components
│   ├── components/             # Minimal template components
│   ├── layouts/                # Layout components
│   └── theme/                  # MUI theme
├── public/                     # Static assets
├── .env                        # Environment variables
├── package.json                # Dependencies
└── README.md                   # Documentation
```

## Dependencies

### Core
- react, react-dom
- next
- electron
- express
- mysql2

### UI
- @mui/material
- @emotion/react
- @emotion/styled

### Utilities
- cors
- dotenv
- axios
- prop-types

### Dev Dependencies
- electron-builder
- concurrently
- wait-on
- eslint

## Deployment

### Desktop App
1. Build Next.js: `npm run build`
2. Package app: `npm run package`
3. Distribute from `dist/` folder

### Web Only (Optional)
1. Deploy Next.js to Vercel/Netlify
2. Deploy Express to cloud server
3. Update NEXT_PUBLIC_API_URL

## Maintenance

### Database Backups
```bash
mysqldump -u root -p tiffin_management > backup.sql
```

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Logs
- Server logs: Console output
- Electron logs: Dev tools console
- Database logs: MySQL error log

## Troubleshooting

### Port Conflicts
Change ports in `.env` and `package.json`

### Database Connection
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### Electron Issues
- Clear cache: `rm -rf .next`
- Reinstall: `npm clean-install`

## Future Enhancements

- User authentication
- PDF export
- Analytics dashboard
- Inventory tracking
- Multi-language support
- Recipe categorization
- Nutritional information
- Cost trending analysis

---

**Last Updated:** November 2024
