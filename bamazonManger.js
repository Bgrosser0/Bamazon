// ================================================
// PART 2
// ================================================

// ================================================
// MANAGER VIEW
// ================================================

// ==============================================
// REQUIREMENTS
// ==============================================

var inquirer = require('inquirer');
var mysql = require("mysql");

// ==============================================
// SET UP CONNECTION TO MYSQL
// ==============================================

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });

// ===============================================
// PART 1
// ===============================================

// ===============================================
// BEGIN APPLICATION
// ===============================================

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
// run the start function after the connection is made to prompt the user
    managerQuery();
});

// List a set of menu options:

function managerQuery() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Options:",
          choices: [
              // View Products for Sale
              "View Products for Sale",
              // View Low Inventory
              "View Low Inventory",
              // Add to Inventory
              "Add to Inventory",
              // Add New Product
              "Add New Product"
          ],
          name: "action"
        }
      ])
      .then(function(answer) {
          switch (answer.action) {
          case "View Products for Sale":
            viewProducts();
            break;
          
          case "View Low Inventory":
            viewLowInv();
            break;

          case "Add to Inventory":
            addToInv();
            break;

          case "Add New Product":
            addNewInv();
            break;
          }
        });
      };

// ======================================================================
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// ======================================================================

// ======================================================================
// COMPLETE
// ======================================================================

function viewProducts() {
    console.log("")
    console.log("Viewing Products")
    console.log("")

    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
        }
        console.log("-----------------------------------");
        connection.end();
    });
}

// ======================================================================
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// ======================================================================

// ======================================================================
// COMPLETE
// ======================================================================

function viewLowInv() {
    console.log("")
    console.log("Viewing Low Inventory")
    console.log("")

    connection.query("SELECT * FROM products", function(err, res) {

        for (var i = 0; i < res.length; i++) {

            if (res[i].stock_quanity < 5) {

            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
        
            }
            else {
            console.log("No Low Stock")
            }
        }
        connection.end();
    }); 
}

// =======================================================================
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// =======================================================================

// ADD INQUIRER OPTIONS AND MAKE THE QUANITY BE ADDED TO NOT FUNDAMENTALLY CHANGED

function addToInv() {
  connection.query("SELECT * FROM products", function(err, res) {


    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the product id of the inventory you are adding to?",
          name: "idToUpdate"
        },
        {
          type: "input",
          message: "How much product are you adding?",
          name: "addedProduct"
        }
      ]).then(function(answer) {
        console.log("Add to Inventory")
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                  // WHY DOESN'T THIS CHANGE ANYTHING?
                    stock_quanity: parseInt(res[answer.idToUpdate - 1].stock_quanity) + parseInt(answer.addedProduct),
                },
                {
                    item_id: parseInt(answer.idToUpdate),
                }
            ],
            function(err, res) {
               
            }
        );
        console.log(query.sql);
        connection.end();
      });
}
)}


// ========================================================================
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
// ========================================================================

// ========================================================================
// COMPLETE
// ========================================================================

function addNewInv() {

    inquirer
      .prompt([
          {
            type: "input",
            message: "What is the name of the new product?",
            name: "newProductName"
          },
          {
            type: "input",
            message: "What is the designated department of the new product?",
            name: "newProductDepartment"
          },
          {
            type: "input",
            message: "What is the price of the new product?",
            name: "newProductPrice"
          },
          {
            type: "input",
            message: "What is the stock of the new product?",
            name: "newProductStock"
          },
      ]).then(function(answer) {

    console.log("Adding New Product to Inventory")
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.newProductName,
          department_name: answer.newProductDepartment,
          price: parseInt(answer.newProductPrice),
          stock_quanity: parseInt(answer.newProductStock)
        },
        function(err, res) {
            console.log(res.affectedRows + " Product Added\n");
        }
    );
    console.log(query.sql);
    connection.end();
    })

}