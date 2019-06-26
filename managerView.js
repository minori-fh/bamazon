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
          
        } else if (inquirerResponse.managerActions === "view low inventory"){
           
        } else if (inquirerResponse.managerActions === "add to inventory"){

        } else if (inquirerResponse.managerActions === "add new product"){

        }
    });
  };
