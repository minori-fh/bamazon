var inquirer = require("inquirer");
var mysql = require("mysql");

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
            addInv()
        } else if (inquirerResponse.managerActions === "add new product"){
            addNewProduct()
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
  }

