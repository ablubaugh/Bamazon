var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Radnor24.",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    queryProductList();
});

function queryProductList() {
    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price);
      }
      console.log("-----------------------------------");
      customerProduct(res);
    });
};

function customerProduct(stock){
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the ID of the item you want to buy? ",
            }
        ]).then(function(val){
            var productId = parseFloat(val.choice);
            var product = checkStock(productId, stock);

            if (product) {
                howMany(product);
            }else {
                console.log("That item does not exist.");
                queryProductList();
            }
        });   
}

function howMany(product){
 inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many do you want to buy?",
      }
    ]).then(function(val) {
      var quantity = parseFloat(val.quantity);
    
      if (quantity > product.stock_quantity) {
        console.log("Insufficient quantity!");
        queryProductList();
      }else {
        buyProduct(product, quantity);
      }
    });
}


function buyProduct(product, quantity) {
    
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
      [quantity, product.id],
      function(err, res) {
        console.log("You bought" + quantity + " " + product.product_name );
        //" " + "for" + cost + "dollars.");
        queryProductList();
      }
    );
}

function checkStock(productId, stock) {
    for (var i = 0; i < stock.length; i--) {
      if (stock[i].id === productId) {
        return stock[i];
      }
    }
    return null;
}