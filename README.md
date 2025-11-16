# Tiffin Management System (Recipe & Ingredient Management)

A professional desktop application built with React, Next.js, Electron, and MySQL for managing restaurant ingredients, vendor pricing, and recipe costs.

## 🚀 Features

- **Product Management**: Add, edit, and manage ingredients with multi-vendor pricing
- **Recipe Management**: Create recipes with automatic cost calculation
- **Multi-Vendor Support**: Track up to 3 vendors per product with default pricing
- **Cost Analysis**: Automatic recipe cost calculation based on ingredient quantities
- **Desktop Application**: Cross-platform desktop app powered by Electron
- **Responsive UI**: Beautiful Material-UI based interface adapted from Minimal template
- **Real-time Search**: Filter products and recipes instantly
- **Database Persistence**: MySQL database for reliable data storage

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

```sql
CREATE DATABASE tiffin_management;
```

### 3. Configure Environment

Create `.env` file:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tiffin_management
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚀 Running the Application

### Development Mode

```bash
npm run electron:dev
```

This starts Express backend, Next.js frontend, and Electron.

### Alternative

```bash
# Terminal 1
npm run dev:server

# Terminal 2  
npm run dev:next

# Terminal 3
electron .
```

## 📦 Building for Production

```bash
npm run build
npm run package
```

## 📚 Project Structure

```
├── electron/          # Electron main process
├── server/            # Express backend + MySQL
├── src/
│   ├── pages/dashboard/
│   │   ├── products/  # Product management
│   │   └── recipes/   # Recipe management
│   └── sections/      # UI components
└── package.json
```

## 🎯 Usage Guide

### Products
1. Go to Dashboard > Products > List
2. Click "Add Product"
3. Fill product info and vendor details (up to 3)
4. Set default vendor for cost calculations

### Recipes
1. Go to Dashboard > Recipes > List
2. Click "Add Recipe"  
3. Add ingredients and quantities
4. View automatic cost calculation

## 🔌 API Endpoints

**Products:** GET/POST/PUT/DELETE `/api/products`  
**Recipes:** GET/POST/PUT/DELETE `/api/recipes`

## 🗄️ Database Schema

- `products` - Product information
- `vendors` - Vendor pricing per product
- `recipes` - Recipe details
- `recipe_ingredients` - Recipe-product relationships

## 📝 Notes

- Built on Minimal v4.1.0 template
- Material-UI for components
- MySQL2 with connection pooling
- Electron with context isolation

---

**Built with React + Next.js + Electron + MySQL**
