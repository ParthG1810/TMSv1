#!/bin/bash

echo "========================================"
echo "Tiffin Management System - Setup Script"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL command not found. Please ensure MySQL is installed."
else
    echo "✅ MySQL is available"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📝 Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  Please edit .env with your database credentials!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create MySQL database: CREATE DATABASE tiffin_management;"
echo "2. Edit .env file with your database credentials"
echo "3. Run: npm run electron:dev"
echo ""
