CREATE DATABASE retail_store;
USE retial_store;
CREATE TABLE Suppliers(
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName VARCHAR(100),
    ContactNumber VARCHAR(15)
);
CREATE TABLE Products(
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100),
    Price DECIMAL(10,2),
    StockQuantity INT,
    SupplierID INT,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);
CREATE TABLE Sales(
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT ,
    QuantitySold INT,
    SaleDate DATE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
-- I excuted them on xampp admin thats just my code as a proof.