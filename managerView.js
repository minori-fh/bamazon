var inquirer = require("inquirer");
var mysql = require("mysql");

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

      inquirer
      .prompt([
          {
          type: "list",
          message: "What would you like to do today?",
          choices: ["view manager actions", "quit"],
          name: "command"
          },
      ])
      .then(function(inquirerResponse){
          if (inquirerResponse.command === "view manager actions"){
              managerActions();
          } else {
              connection.end();
          };
      });
  });

  function managerActions(){
    inquirer
    .prompt([
        {
        type: "list",
        message: "What would you like to do today?",
        choices: ["view products for sale", "view low inventory", "add to inventory", "add new product"],
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
        }
    });
  };

  function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err; 

        console.log("ID" + " | " + "PRODUCT_NAME" + " | " + "DEPT_NAME" + " | " + "PRICE" + " | " + "STOCK")

        for (var i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity)
        };
        managerActions();
    });
  };

  function viewLow(){
    connection.query("SELECT product_name, stock_quantity, price, department_name, item_id FROM products GROUP BY product_name, stock_quantity, price, department_name, item_id HAVING stock_quantity < 5", function(err, res){
        if (err) throw err; 

        console.log("ID" + " | " + "PRODUCT_NAME" + " | " + "DEPT_NAME" + " | " + "PRICE" + " | " + "STOCK")

        for (var i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity)
        };
        managerActions();
    });
  };

  function addInv(id, newStock){
    console.log("hello")
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

                // console.log(newProdCat)
                // console.log(newProdName)
                // console.log(newProdPrice)
                // console.log(newProdStock)

                updateNew(newProdName, newProdCat, newProdPrice, newProdStock)
        
            // connection.query("INSERT INTO products SET ?",[{product_name: newProdName}, {department_name: newProdCat}, {price: newProdPrice}, {stock_quantity: newProdStock}], function(err){
            //     if (err) throw err; 
        
            //     console.log("Inventory has been updated!")
            //     viewProducts()
            // });
            });
    });
  };

  function updateNew(newProdName, newProdCat, newProdPrice, newProdStock){

    console.log(newProdCat)
    console.log(newProdName)
    console.log(newProdPrice)
    console.log(newProdStock)

    connection.query("INSERT INTO products SET ?",[{product_name: newProdName}, {department_name: newProdCat}, {price: 40}, {stock_quantity: 5},], function(err){
        if (err) throw err; 

        console.log(newProdCat)
        console.log(newProdName)
        console.log(newProdPrice)
        console.log(newProdStock)

        console.log("Inventory has been updated!")
        viewProducts()
    });

  }



