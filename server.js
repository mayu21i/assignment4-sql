const express = require('express');
const { pool, initDB } = require('./db');
const app = express();
const PORT = 3000;

app.use(express.json());
// cereate product
app.post('/products' , async (req , res) =>{
    try{
        const {ProductName , Price ,  StockQuantity  , SupplierID} = req.body ;
        const [result] = await pool.execute(`INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
        VALUES (? , ? , ? , ?)` ,
        [ProductName , Price ,  StockQuantity  , SupplierID]);
        res.status(201).json({
            message: "Product cereated successfully!",
            ProductID: result.insertId,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            error: "Couldn't cereate product"
        });
    }  
});

//Retrieve all products
app.get('/products' , async(req , res) => {
    try{
        const[products] = await pool.query(`SELECT * FROM Products`)
        res.status(200).json(products)

    }catch(error){
        console.log(error);
        res.status(500).json({
            error: "Couldn't retrieve products"
        });
    }
});
//Retrieve a product by ID
app.get('/products/:id' , async (req , res) => {
    try{
        const id = req.params.id ;
        const [products] = await pool.execute(`SELECT * FROM Products WHERE ProductID = ?` , [id]);
        if(products.length === 0){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json(products[0]);
    }catch(error){
        console.log(error);
        res.status(500).json({
            error: "Couldn't retrieve product"
        });
    }
})
//update a product
app.put('/products/:id' , async (req , res) => {
    try{
        const { ProductName, Price, StockQuantity, SupplierID } = req.body;

        const [result] = await pool.execute(`UPDATE Products 
            SET  ProductName = ? ,Price = ? , StockQuantity = ? , SupplierID = ?
            WHERE ProductID = ? ` , [ProductName, Price, StockQuantity, SupplierID , req.params.id]
        );
        if(result.affectedRows === 0){
            return res.status(404).json({
                message : "Product not found"
            });
        }
        res.status(200).json({
            message : "Product updated successfully"
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            error: "Couldn't update product"
        });
    }
})
//delete category  (i moved it above delete product so express does not treat category as :id)
app.delete('/products/category' , async (req , res) =>{
    try{
        await pool.query(
            `ALTER TABLE Products
            DROP COLUMN Category`
        );
        res.status(200).json({
            message: "Category column removed"
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Couldn't remove Category column" });
    }
});
//q8 put it here for the same reason i said above
app.delete("/products/by-name/eggs", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM Products WHERE ProductName = ?",
      ["Eggs"]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Eggs product not found" });
    }

    res.status(200).json({ message: "Eggs product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't delete Eggs" });
  }
});

//Delete a product
app.delete('/products/:id' , async (req , res) => {
    try{
        const [result] = await pool.execute(
            `DELETE FROM Products
            WHERE ProductID = ?`,
            [req.params.id]
        );
        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product deleted successfully"
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            error: "Couldn't delete product"
        });
    }
});
// Create a supplier
app.post("/suppliers", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
      [SupplierName, ContactNumber]
    );

    res.status(201).json({
      message: "Supplier created successfully",
      SupplierID: result.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't create supplier" });
  }
});

// Retrieve all suppliers
app.get("/suppliers", async (req, res) => {
  try {
    const [suppliers] = await pool.query("SELECT * FROM Suppliers");
    res.status(200).json(suppliers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve suppliers" });
  }
});

// Update a supplier
app.put("/suppliers/:id", async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    const [result] = await pool.execute(
      `UPDATE Suppliers
       SET SupplierName = ?, ContactNumber = ?
       WHERE SupplierID = ?`,
      [SupplierName, ContactNumber, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't update supplier" });
  }
});

// Delete a supplier
app.delete("/suppliers/:id", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM Suppliers WHERE SupplierID = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Couldn't delete supplier. It may still have products.",
    });
  }
});
// Record a sale
app.post("/sales", async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
       VALUES (?, ?, ?)`,
      [ProductID, QuantitySold, SaleDate]
    );

    res.status(201).json({
      message: "Sale recorded successfully",
      SaleID: result.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't record sale" });
  }
});

// Retrieve all sales
app.get("/sales", async (req, res) => {
  try {
    const [sales] = await pool.query("SELECT * FROM Sales");
    res.status(200).json(sales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve sales" });
  }
});

// Retrieve sales for one product
app.get("/products/:id/sales", async (req, res) => {
  try {
    const [sales] = await pool.execute(
      "SELECT * FROM Sales WHERE ProductID = ?",
      [req.params.id]
    );

    res.status(200).json(sales);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve sales for this product" });
  }
});
//add category column
app.post('/products/category' , async (req , res) => {
    try{
        await pool.query(
            `ALTER TABLE Products
            ADD COLUMN Category VARCHAR(100)`    
        );
        res.status(200).json({
            message: "Category column added"
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Couldn't add Category column" });
    }
});
//change contactNumber column
app.patch('/suppliers/contact-number' , async (req , res) => {
    try{
        await pool.query(
            `ALTER TABLE Suppliers
            MODIFY COLUMN ContactNumber VARCHAR(15)`
        );
        res.status(200).json({
            message: "ContactNumber changed to VARCHAR(15)"
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Couldn't change ContactNumber" });
    };
});
//Add a NOT NULL constraint to ProductName
app.patch("/products/product-name-required", async (req , res) =>{
    try{
        await pool.query(
            `ALTER TABLE Products 
            MODIFY COLUMN ProductName VARCHAR(100) NOT NULL`
        );
        res.status(200).json({
            message : "ProductName is now required"
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Couldn't make ProductName required" });
    }
})
// Insert the assignment's sample data
app.post("/seed-data", async (req , res) => {
    const connection = await pool.getConnection();

    try{
        await connection.beginTransaction();

        const [supplier] = await connection.execute(
            `INSERT INTO Suppliers (SupplierName, ContactNumber)
            values(? , ?)`,
            ["FreshFoods", "01001234567"]
        );
        const supplierID = supplier.insertId;
        const [milk] = await connection.execute(
            `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
            VALUES (?, ?, ?, ?)`,
            ["Milk", 15.00, 50, supplierID]
        );
        await connection.execute(
            `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
            VALUES (?, ?, ?, ?) ` ,
            ["Bread", 10.00, 30, supplierID]
        );
        await connection.execute(
            `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
            VALUES (?, ?, ?, ?) ` ,
            ["Eggs", 20.00, 40, supplierID]
        );
        await connection.execute(
            `INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
            VALUES (?, ?, ?) ` ,
            [milk.insertId, 2, "2025-05-20"]
        );
        await connection.commit();
        res.status(201).json({
            message : "Sample data inserted successfully"
        });
    }catch(error){
        await connection.rollback();
        console.log(error);
        res.status(500).json({
            message: "Couldn't insert sample data" 
        });  
    }finally{
        connection.release();
    }
});
//q7
app.patch("/products/bread/price" , async (req , res) =>{
    try{
        const [result] = await pool.execute(
            `UPDATE Products 
            SET Price = ? 
            WHERE ProductName = ? `,
            [25.00, "Bread"]
        );
        if(result.affectedRows === 0){
            return res.status(404).json(
                {
                    message:  "Bread product not found" 
                }
            );
        }
        res.status(200).json({
            message: "Bread price updated to 25.00"
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Couldn't update Bread's price" });
    }
});
//q9
app.get("/reports/total-quantity-sold", async (req, res) => {
  try {
    const [report] = await pool.query(`
      SELECT ProductID, SUM(QuantitySold) AS TotalQuantitySold
      FROM Sales
      GROUP BY ProductID
    `);

    res.json(report);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve sales totals" });
  }
});
// q10
app.get("/reports/highest-stock", async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT *
      FROM Products
      ORDER BY StockQuantity DESC
      LIMIT 1
    `);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't retrieve highest-stock product" });
  }
});
//q11
app.get("/reports/suppliers-starting-with-f" , async (req , res) =>{
    try{
        const [suppliers] = await pool.execute(
            `SELECT * FROM Suppliers 
            WHERE SupplierName LIKE ?` ,
            ['F%']
        );
        res.status(200).json(suppliers);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Couldn't retrieve suppliers" });  
    }
});
//q12
app.get("/reports/never-sold", async (req , res) => {
    try{
        const [products] = await pool.query(
            `SELECT p.*
            FROM Products p LEFT JOIN Sales s 
            ON p.ProductID = s.ProductID
            WHERE s.ProductID IS NULL`
        );
        res.status(200).json(products);
    }catch(error){
        console.log(error);
        res.status(500).json({
        error: "Couldn't retrieve products that were never sold",
    });
    }
});
//q13
app.get("/reports/sales-details" , async (req , res) =>{
    try{
        const [sales] = await pool.query(
            `SELECT p.ProductName , s.QuantitySold , s.SaleDate
            FROM Sales s JOIN Products p
            ON p.ProductID = s.ProductID `
        );
        res.status(200).json(sales);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Couldn't retrieve sales details" });
    }

});
//q14,15,,16 i solved it in a separsted file

initDB()
    .then(() => {
        app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('DB init failed:', err);
        process.exit(1);
    });