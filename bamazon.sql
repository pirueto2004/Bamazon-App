DROP DATABASE IF EXISTS bamazon_db;

CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products(
   item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
   product_name VARCHAR(500) NOT NULL,
   department_name VARCHAR(50) NOT NULL,
   price DECIMAL(10,2) NOT NULL,
   stock_quantity INTEGER(10) NOT NULL,
  
   PRIMARY KEY (item_id)
);


SELECT * FROM products;

-- Insert "mock" data rows into this database and table
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("TCL 50 inch 4K Smart LED Roku TV", "Electronics", 279.99, 5),
("Smart, Hands-Free Video Calling with Alexa Built-in", "Computers & Accessories", 129.00, 5),
("Molivera Organics Sweet Almond Oil, 16 oz.", "Beauty & Personal Care", 13.67, 10),
("Wireless Car Charger, 2 in 1", "Cell Phones & Accessories", 22.99, 5),
("Band of Brothers (hardcover books)", "Books", 40.92, 10),
("AstroAI Digital Tire Pressure Gauge 150 PSI (1 Pack)", "Automotive", 7.18, 15),
("Doris Women's Casual Dress", "Fashion", 12.99, 10),
("Sekey Home 58 Entertainment Center Wood Media TV Stand", "Furniture", 152.98, 5),
("Oberto Original Beef Jerky Trail Mix, 2 Ounce (Pack of 8)", "Grocery", 13.95, 10),
("LUCID 2 Inch 5 Zone Lavender Memory Foam Mattress Topper - Full", "Home", 36.57, 10);

DELETE FROM products;
