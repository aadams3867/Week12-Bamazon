var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("");
    console.log("Welcome to Bamazon! :)");
    console.log("");
    storefront();
});

// Initialize global var
var maxID = 1;  // There's at least 1 item for sale on Bamazon

// Display all items available for sale
var storefront = function() {
    console.log("Please browse our current sale items:");
    console.log("=====================================");

	var qry = 'SELECT ItemID, ProductName, Price FROM products'; 
	    connection.query(qry, function (err, res) {
	      if (err) {
	        console.log("MySQL Error", err);
	      }

	      maxID = res.length;

	      for (var i=0; i<maxID; i++){
	        console.log("Item ID: " + res[i].ItemID + " || " + res[i].ProductName + " || Price: $" + res[i].Price);
	      }
	      buySomething(maxID);
	})
};

// Shut up and take my money!
var buySomething = function(maxID) {
    inquirer.prompt([{
	    name: "item",
	    message: "What is the Item ID of the product you'd like to buy?",
	    validate: function(value) {
	      if (isNaN(value)) {  // The input is NOT a number
	        return false;
	      } else {  // The input IS a number

	        if (value < 1 || value > maxID) {  // The input number is too small or large
	        	return false;
	        } else {  // The input number IS in the range of possibility
	        	return true;
	        }

	      }
	    }
	}, {
		name: "qty",
		message: "How many units of the product would you like to buy?",
		validate: function(value) {
	      if (isNaN(value)) {  // The input is NOT a number
	        return false;
	      } else {  // The input IS a number

	      	if (value < 1) {  // The input number is too small
	      		return false;
	      	} else {  // The input number IS in the range of possibility
	      		return true;
	      	}

	      }
	    }
	}]).then(function(answer) {
	    var qry = 'SELECT StockQty FROM products WHERE ?'; 
    	connection.query(qry, [{ItemID: answer.item}], function (err, res) {
      		if (err) {
		        console.log("MySQL Error", err);
		    }

		    if (res[0].StockQty >= answer.qty) {  // Enough stock to sell
		        var newQty = (res[0].StockQty - answer.qty)
		        connection.query("UPDATE products SET ? WHERE ?", [{
					StockQty: newQty
				}, {
					ItemID: answer.item
				}], function (err, res) {
					console.log("Order placed successfully!");
					receipt(answer.item, answer.qty);
				});
		    } else {  // Not enough stock to cover this sale!
		    	console.log("Error!  Insufficient quantity!");
		    	console.log("Bamazon only has " + res[0].StockQty + " unit(s) on hand at this time.");
		    	console.log("Please try again with a different product or quantity");
		    	buySomething(maxID);
		    }
		    
		})
	})
};

// Thank you, come again!
var receipt = function(item, numSold) {
	console.log("");
    console.log("Here is your receipt:");
    console.log("=====================");

	var qry = 'SELECT ProductName, Price FROM products WHERE ?'; 
    connection.query(qry, [{itemID: item}], function (err, res) {
      	if (err) {
        	console.log("MySQL Error", err);
      	}

      	var totalCost = res[0].Price * numSold;
        console.log(numSold + " x " + res[0].ProductName + " at $" + res[0].Price + " each");
        console.log("Today's total: $" + totalCost.toFixed(2));
        console.log("");
        console.log("Thank you!  Please come again.");
	    connection.end();
	})
};