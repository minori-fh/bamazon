DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB; 

USE bamazonDB; 

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (30) NOT NULL,
    department_name VARCHAR (30) NOT NULL,
    price DECIMAL (20,2) NOT NULL,
    stock_quantity INT(30) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES
("bloodletter", "weapon", 400, 20),
("swift claw", "mount", 350, 40),
("assasin's jacket", "armor", 200, 50),
("cross bow", "weapon", 180, 100),
("treasure chest", "accessory", 50, 200),
("Nori's island", "land", 1000, 2),
("carrot farm", "land", 380, 10),
("polar bear", "mount", 500, 13);