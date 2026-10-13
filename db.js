const mysql = require('mysql2/promise');

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306
};

const pool = mysql.createPool({
    ...config,
    database: 'retail_store',
    waitForConnections: true,
    connectionLimit: 10
});

async function initDB() {
    // 1. create the database if it doesn't exist
    const conn = await mysql.createConnection(config);
    await conn.query('CREATE DATABASE IF NOT EXISTS retail_store');
    await conn.end();

    // 2. create the tables (parent tables first)
    await pool.query(`CREATE TABLE IF NOT EXISTS Suppliers(
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName VARCHAR(100),
        ContactNumber VARCHAR(15)
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS Products(
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName VARCHAR(100),
        Price DECIMAL(10,2),
        StockQuantity INT,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS Sales(
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT,
        QuantitySold INT,
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )`);
}

module.exports = { pool, initDB };