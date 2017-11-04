var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  console.log("\n");
  afterConnection();
});


function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {

      console.log(
        "ID: " +
        res[i].id +
        " || Product Name: " +
        res[i].product_name +
        " || Department Name: " +
        res[i].department_name +
        " || Price: $" +
        res[i].price +
        " || Stock Quantity: " +
        res[i].stock_quantity
      );

    }
    console.log("\n");
    placeOrder();
  });
}


function placeOrder() {
  inquirer
    .prompt([{
      name: "id",
      type: "input",
      message: "Enter the ID of the product you would like to buy: "
    }, {
      name: "quantity",
      type: "input",
      message: "How many of this product? "
    }])
    .then(function (answer) {

      connection.query("SELECT * FROM products WHERE ?", {
        id: answer.id
      }, function (err, res) {
        if (err) throw err;

        var orderQuantity = answer.quantity;
        var product = res[0].product_name;
        var cost = res[0].price;
        var stock = res[0].stock_quantity;

        if (orderQuantity < stock) {
          console.log("\n");
          console.log("You ordered: " + orderQuantity + " of " + product + " at a cost of $" + cost + " each");
          console.log("Your total cost is $" + cost * orderQuantity);
          console.log("THANK YOU FOR YOUR BUSINESS! COME BACK SOON.");

          var newStockAmount = stock - orderQuantity;
          var query = connection.query(
            "UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStockAmount
              },
              {
                id: answer.id
              }
            ],
            function (err, res) {
              console.log(res.affectedRows + " products updated!\n");
              setTimeout(afterConnection, 2000);
            }
          );
        } else {
          console.log("There are only " + stock + " in stock, please choose a lesser amount.");
          placeOrder();
        }
      });
    });
};