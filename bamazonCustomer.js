// Pull in required dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');
const figlet = require('figlet');
const chalk = require('chalk');


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

const error = chalk.bold.red;
const success = chalk.bold.blue;
const bgCyan = chalk.bold.whiteBright.bgBlueBright;
const magenta = chalk.bold.magentaBright;

connection.connect(function(err) {
    if (err) throw err;
	console.log("connected as id " + connection.threadId);
	addHeader('BAMAZON');
});

function addHeader(text){
	figlet(text, {font: 'Standard', horizontalLayout: 'full'}, function(err, data) {
		if (err) {
			console.log(error('Something went wrong...'));
			console.dir(err);
			return;
		}
		console.log(data)
		console.log(bgCyan('*********************************'));
		console.log(bgCyan('*  YOUR ONLINE BEST-DEAL STORE  *'));
		console.log(bgCyan('*********************************'));
		displayInventory();
		console.log("\nPlace Your Order Now!\n");
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
		customerInquirer();
	});
};

// validateInteger makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return error('Please enter a whole non-zero number.');
	}
}

function purchasePrompt(){
	inquirer.prompt([
	{
		name: "ID",
		type: "input",
		message:"Please enter Item ID you like to purchase.",
		validate: validateInput,
		filter: Number
	},
	{
		name:"Quantity",
		type:"input",
		message:"How many items do you wish to purchase?",
		validate: validateInput,
		filter: Number
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
			if(res[0] == undefined){
				console.log(error('************************************************************************'));
				console.log(error('*                 SORRY... WE FOUND NO ITEMS WITH ID "' +  ID + '"              *'));
				console.log(error('************************************************************************'));
				return purchasePrompt();
			  }
			if(amtNeeded <= res[0].stock_quantity){
				let newStock_quantity = res[0].stock_quantity - amtNeeded;
				let totalCost = res[0].price * amtNeeded;
				let sales = res[0].product_sales + parseFloat(totalCost);
				let department = res[0].department_name;
				console.log(success("Good news your order is in stock!\n"));
				console.log("Your total cost for " + amtNeeded + " " +res[0].product_name + " is " + totalCost);
				console.log("\nThank you for your purchase! Your Order will be delivered to you within 2 days from now.");
				//Update inventory with new quantity and sales
				updateDeptSales(department,sales);
				updateInventory(ID,newStock_quantity,sales);
				console.log("Inventory Updated...\n");
				
			} else{
				console.log(error("Insufficient quantity, sorry we do not have enough " + success(res[0].product_name) + " to complete your order."));
				console.log("We only have " + success(res[0].stock_quantity) + " in stock at this time.");
				inquirer.prompt([
					{
						name: "confirm",
						type: "confirm",
						message:"Would you like to buy this amount of items anyway?",
					},
					
				 ]).then(function(answer){
					if (answer.confirm) {
						purchaseOrder(ID,res[0].stock_quantity);
					}
					else{
						return customerInquirer();
					}
					
				 });
			};
		});
	
};

function updateDeptSales(dept,sales){
	connection.query(
		"UPDATE departments SET ? WHERE ?",
		[
			{
			   department_sales: sales
			},
			{
			  
			   department_name: dept
			}
		],
		function(err, res) {
			if (err) throw err;
			
		}
	);
}

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
		console.log('CONTINUE SHOPPING...');
		addHeader('BAMAZON');
      }
    );
};

function customerInquirer(){
	inquirer.prompt([{
		name:"action",
		type: "list",
		message: "Choose an option below to better serve you!",
		choices: ["Place an order", "Exit"]
	}]).then(function(answers){
		switch(answers.action){
            case 'Place an order':
                purchasePrompt();
                break;
            case 'Exit':
				console.log('Bye!');
				process.exit(22);
				break;		
		}
	});
};
