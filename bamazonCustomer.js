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
    runBamazon();
});

// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// ================================================
// DISPLAY PRODUCT INVENTORY
// ================================================

    function runBamazon() {
        connection.query("SELECT * FROM products", function(err, res) {
          for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
          }
          console.log("-----------------------------------");
          productQuery();
        });
      }
 
// The app should then prompt users with two messages.

// ================================================
// QUERY USER
// ================================================

    function productQuery() {
        inquirer
          .prompt([
    // The first should ask them the ID of the product they would like to buy.
            {
              type: "input",
              message: "what is the ID of the product you'd like to buy?",
              name: "productID"
            },
    // The second message should ask how many units of the product they would like to buy.
            {
              type: "input",
              message: "How Many Units Would You Like to Buy?",
              name: "numUnits"
            }
          ]).then(function(answer) {
            connection.query("SELECT * FROM products", function(err, res) {
            if (parseInt(answer.numUnits) > 0) {
                console.log("")
                console.log("You want " + answer.numUnits + " " + res[answer.productID - 1].product_name +"?")
            }
        
            else {
                console.log("That don't make no sense")
            }
        });

// =================================================
// CHECK INVENTORY
// =================================================

    checkInventory();
                  
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

function checkInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
    
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

    if (res[answer.productID - 1].stock_quanity == 0) {
        console.log("")
        console.log("Insufficient Quantity!")
    }

// However, if your store does have enough of the product, you should fulfill the customer's order.

    else {
        console.log("")
        console.log("Stock Quanity")
        console.log(res[answer.productID - 1].stock_quanity)
        // productID.totalUnits - inquirerResponse.numUnits
        // =================================================================
        updateInv(); 
    } 
    });
}
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

// ================================================
// UPDATE INVENTORY
// ================================================

function updateInv() {
    connection.query("SELECT * FROM products", function(err, res) {

    console.log("")
    console.log("You want this many units")
    console.log(answer.numUnits)
    console.log("")
    console.log("CURRENT INV")
    console.log(res[answer.productID - 1].stock_quanity)

    console.log("Updating Inventory...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
        stock_quanity: parseInt(res[answer.productID - 1].stock_quanity) - parseInt(answer.numUnits),
        },
        {
          item_id: res[answer.productID - 1].item_id,
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " Inventory Updated!\n");
        displayTotal();
      }
    );
    // console.log(query.sql);
}
    )};
    // ==========================================    

function displayTotal() {
    connection.query("SELECT * FROM products", function(err, res) {

    console.log("")
    console.log("UPDATED INV")
    console.log(parseInt(res[answer.productID - 1].stock_quanity))
    console.log("")
    console.log("Total Cost of Purchase")
    console.log(parseInt(res[answer.productID - 1].price) * parseInt(answer.numUnits))
    connection.end();
    })
}

})
};
    
// ================================================
// PART 2
// ================================================

// ================================================
// MANAGER VIEW
// ================================================

// Create a new Node application called bamazonManager.js. Running this application will:


// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.