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

function viewProducts() {
    console.log("")
    console.log("Viewing Products")
    console.log("")

    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
        }
        console.log("-----------------------------------");
    });
}

// ======================================================================
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// ======================================================================

function viewLowInv() {
    console.log("")
    console.log("Viewing Low Inventory")
    console.log("")

    connection.query("SELECT * FROM products", function(err, res) {

        for (var i = 0; i < res.length; i++) {

            if (res[i].stock_quanity < 5) {

            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
        
            console.log("-----------------------------------");
            }
            else {
            console.log("No Low Stock")
            }
        }
    }); 
}

// =======================================================================
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// =======================================================================

// ADD INQUIRER OPTIONS AND MAKE THE QUANITY BE ADDED TO NOT FUNDAMENTALLY CHANGED

function addToInv() {
    console.log("Add to Inventory")
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quanity: 200,
            },
            {
                item_id: 4,
            }
        ],
        function(err, res) {
            console.log(res.affectedRows + " Inventory Updated\n");
            console.log(res.affectedRows.product_name);
        }
    );
    console.log(query.sql);
}

// ========================================================================
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
// ========================================================================

function addNewInv() {
    console.log("Add New Product to Inventory")
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: "Hot Dogs",
          department_name: "Grocery",
          price: 4,
          stock_quanity: 350
        },
        function(err, res) {
            console.log(res.affectedRows + " Product Added\n");
        }
    );
    console.log(query.sql);
}