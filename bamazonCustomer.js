// Pull in required dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');
const figlet = require('figlet');


// Define the MySQL connection parameters
const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	// Your username
	user: 'root',
	// Your password
	password: "Timbre@1966",
	database: 'bamazon_db'
});


connection.connect(function(err) {
    if (err) throw err;
	console.log("connected as id " + connection.threadId);
	addHeader('Place Your Order Now!');
});

function addHeader(message){
	figlet('BAMAZON', function(err, data) {
		if (err) {
			console.log('Something went wrong...');
			console.dir(err);
			return;
		}
		console.log(data)
		console.log('*********************************');
		console.log('*  YOUR ONLINE BEST-DEAL STORE  *');
		console.log('*********************************');
		displayInventory();
		console.log(message);
	});
}

function displayInventory(){
	let querySelect = "SELECT * FROM products";
	connection.query(querySelect, function(err, res){
		if(err) throw err;
		let displayTable = new Table ({
			head: ["Item ID", "Product Name", "Category", "Price", "Quantity", "Sales"],
			colWidths: [10,50,30,15,15,15]
		});
		for(let i = 0; i < res.length; i++){
			displayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]
				);
		}
		console.log(displayTable.toString());
		purchasePrompt();
	});
};

function purchasePrompt(){
	inquirer.prompt([
	{
		name: "ID",
		type: "input",
		message:"Please enter Item ID you like to purchase.",
		filter:Number
	},
	{
		name:"Quantity",
		type:"input",
		message:"How many items do you wish to purchase?",
		filter:Number
	},

 ]).then(function(answers){
 	let quantityNeeded = answers.Quantity;
	let IDrequested = answers.ID;
	purchaseOrder(IDrequested, quantityNeeded);
 });
};

function purchaseOrder(ID, amtNeeded){
	let querySelectId = "SELECT * FROM products WHERE ?";
	connection.query(querySelectId,
		{
			item_id: ID 
		}, 
		function(err,res){
			if(err) throw err;
			if(amtNeeded <= res[0].stock_quantity){
				let newStock_quantity = res[0].stock_quantity - amtNeeded;
				let totalCost = res[0].price * amtNeeded;
				let sales = res[0].product_sales + parseFloat(totalCost);
				console.log("Good news your order is in stock!");
				console.log("Your total cost for " + amtNeeded + " " +res[0].product_name + " is " + totalCost + " Thank you!");
				updateInventory(ID,newStock_quantity,sales);
				console.log("Inventory Updated...\n");
				
			} else{
				console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "to complete your order.");
			};
	    });
};

function updateInventory(id,newStock,sales){
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
		   stock_quantity: newStock,
		   product_sales: sales
        },
        {
		  
		  item_id: id
        }
      ],
      function(err, res) {
		if (err) throw err;
		addHeader('CONTINUE SHOPPING...');
      }
    );
};


