var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table2');

var addInv;
var itemID;
var id;
var add;

var currentStock;
var newStock; 

var newProdCat;
var newProdName; 
var newProdPrice;
var newProdStock;

var table; 

// Create connection with mysql
var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "password",
    database: "bamazonDB"
  });

  connection.connect(function(err){
      if (err) throw err; 

    managerActions()
  });

  function managerActions(){
    inquirer
    .prompt([
        {
        type: "list",
        message: "What would you like to do today?",
        choices: ["view products for sale", "view low inventory", "add to inventory", "add new product", "quit"],
        name: "managerActions"
        },
    ])
    .then(function(inquirerResponse){
        if (inquirerResponse.managerActions === "view products for sale"){
            viewProducts()
        } else if (inquirerResponse.managerActions === "view low inventory"){
            viewLow()
        } else if (inquirerResponse.managerActions === "add to inventory"){
            whichInv()
        } else if (inquirerResponse.managerActions === "add new product"){
            addNew()
        } else if (inquirerResponse.managerActions === "quit"){
            connection.end()
        }
    });
  };

  function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err; 

        table = new Table({
            head: ['ID', 'PRODUCT NAME', 'DEPT', 'PRICE', 'STOCK']
            , colWidths: [5, 20, 15, 10, 10]
        });
    
        for (var i = 0; i < res.length; i++){
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            )
        };
    
        console.log(table.toString());

        managerActions();
    });
  };

  function viewLow(){
    connection.query("SELECT product_name, stock_quantity, price, department_name, item_id FROM products GROUP BY product_name, stock_quantity, price, department_name, item_id HAVING stock_quantity < 5", function(err, res){
        if (err) throw err; 

        table = new Table({
            head: ['ID', 'PRODUCT NAME', 'DEPT', 'PRICE', 'STOCK']
            , colWidths: [5, 20, 15, 10, 10]
        });
    
        for (var i = 0; i < res.length; i++){
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]
            )
        };
    
        console.log(table.toString());

        managerActions();
    });
  };

  function addInv(id, newStock){
    connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: newStock}, {item_id: id}], function(err, res){
        if (err) throw err; 

        viewProducts()
    });
  };

  function whichInv(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err; 

        var currentInv = []

        for (var i=0; i<res.length; i++){
            currentInv.push(res[i].item_id + ". " + res[i].product_name)
        }

        inquirer
        .prompt([
            {
            type: "list",
            message: "What item's inventory would you like to add to?",
            choices: currentInv, 
            name: "addInv"
            },
            {
            type: "input",
            message: "How many would you like to add?",
            name: "count"
            },
        ])
        .then(function(inquirerResponse){
            addInv = inquirerResponse.addInv
            itemID = addInv.split(".")
            id = parseFloat(itemID[0])

            add = parseFloat(inquirerResponse.count)
            currentStock = res[id-1].stock_quantity

            newStock = currentStock + parseFloat(add)

        connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: newStock}, {item_id: id}], function(err){
            if (err) throw err; 

            console.log("Inventory has been updated!")
            viewProducts()
        });
        });
    });
  };

  function addNew(){

    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err; 

        var currentDept = []

        for (var i=0; i<res.length; i++){
            currentDept.push(res[i].department_name)
        }
        
            inquirer
            .prompt([
                {
                type: "list",
                message: "What is the category in which you'd like to add a product?",
                choices: currentDept, 
                name: "newProdCat"
                },
                {
                type: "input",
                message: "What is the name of the product you would like to add?",
                name: "newProdName"
                },
                {
                type: "input",
                message: "What is the price for this product?",
                name: "newProdPrice"
                },
                {
                type: "input",
                message: "How many would you like to have in stock?",
                name: "newProdStock"
                },
            ])
            .then(function(inquirerResponse){
                newProdCat = inquirerResponse.newProdCat
                newProdName = inquirerResponse.newProdName
                newProdPrice = parseFloat(inquirerResponse.newProdPrice)
                newProdStock = parseFloat(inquirerResponse.newProdStock)

                updateNew(newProdName, newProdCat, newProdPrice, newProdStock)
    
            });
    });
  };

  function updateNew(newProdName, newProdCat, newProdPrice, newProdStock){

    var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?"
    var values = [[newProdName, newProdCat, newProdPrice, newProdStock]]
    connection.query(sql, [values], function(err){
        if (err) throw err; 

        console.log("Inventory has been updated!")
        viewProducts()
    });

  }



