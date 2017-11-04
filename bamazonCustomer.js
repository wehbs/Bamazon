var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  // start();
  console.log("connected as id " + connection.threadId);
  afterConnection();
  // console.log("Your connected!!");
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
    placeOrder();
    // connection.end();
  });
}


function placeOrder() {
  inquirer
    .prompt([{
      name: "id",
      type: "input",
      message: "Enter the ID of the product you would like to buy: "
    }, {
      name : "quantity",
      type: "input",
      message: "How many of this product? "
    }])
    .then(function (answer) {
      console.log(answer.id);
      console.log(answer.quantity);
    });

};











//   // function which prompts the user for what action they should take
// function start() {
//     inquirer
//       .prompt({
//         name: "postOrBid",
//         type: "rawlist",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.postOrBid.toUpperCase() === "POST") {
//           postAuction();
//         }
//         else {
//           bidAuction();
//         }
//       });
//   }