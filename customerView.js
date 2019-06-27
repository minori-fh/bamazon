var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table2');

var count = 0; 
var id; 
var quantity; 
var table; 

// Create connection with mysql
var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "password",
    database: "bamazonDB"
  });

  connection.connect(function(err, res){
      if (err) throw err; 
      showAll();
  });

//Function declarations
function showAll(){
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
        inquirer
        .prompt([
            {
            type: "list",
            message: "What would you like to do today?",
            choices: ["make a purchase", "quit"],
            name: "command"
            },
        ])
        .then(function(inquirerResponse){
            if (inquirerResponse.command === "make a purchase"){
                whatID();
            } else {
                connection.end();
            };
        });
    });
};

function whatID(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        count = res.length

        inquirer
        .prompt([
            {
            type: "input",
            message: "What is the ID of the item you would like to purchase?",
            name: "id"
            },
        ])
        .then(function(inquirerResponse){
            id = inquirerResponse.id
            if (inquirerResponse.id <= count){
                whatQuantity(id);
            } else {
                console.log("A product with this ID does not exist!")
                whatID();
            };
        });
    });
};

function updateQuantity(id, newQuantity){
    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {item_id: id}], function(err){
        if (err) throw err;
        console.log("Quantity has been updated! Your purchase is complete. \nHere is an updated product listing: ")
        showAll();
    // connection.end();
    });
};

function whatQuantity(id){
    connection.query("SELECT * FROM products WHERE item_id = ?",[id], function(err, res){
        if (err) throw err;
        stockQuantity = res[0].stock_quantity
        id = res[0].item_id
        
    inquirer
    .prompt([
        {
        type: "input",
        message: "What quantity are you looking to purchase?",
        name: "quantity"
        },
    ])
    .then(function(inquirerResponse){
        if (inquirerResponse.quantity <= stockQuantity){
            newQuantity = stockQuantity - inquirerResponse.quantity
            updateQuantity(id, newQuantity) 
        } else {
            console.log("Not enough in stock!")
            showAll();
        };
    });
});
};


