var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("table")

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
      showAll();

  });

//Function declarations
function showAll(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err; 
        // console.log(res)
        console.log("ID" + " | " + "PRODUCT_NAME" + " | " + "DEPT_NAME" + " | " + "PRICE" + " | " + "STOCK")

        for (var i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity)
        };
    });
};
