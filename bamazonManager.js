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
    managerInquirer();
});

// validateInteger makes sure that the user is supplying only positive integers for their inputs
function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

// validateNumeric makes sure that the user is supplying only positive numbers for their inputs
function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

function displayInventory(){
    console.log('*********************************');
	console.log('*       PRODUCTS FOR SALE       *');
	console.log('*********************************');
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
		inquirer.prompt([{
			name:"action",
			type: "list",
			message: "Choose an option below to manage current inventory:",
			choices: ["View Low Inventory", "Update Product", "Add To Inventory", "Add New Product", "Remove Existing Product", "Exit"]
		}]).then(function(answers){
			switch(answers.action){
				
				case 'View Low Inventory':
					lowRequest();
					break;
				case 'Update Product':
					updateProduct();
					break;	
				case 'Add To Inventory':
					restockRequest();
					break;
				case 'Add New Product':
					addNewProduct();
					break;
				case 'Remove Existing Product':
					removeProduct();
					break;	
				case 'Exit':
					process.exit(22);
					break;	
			}
		});
	});
};

function lowRequest(){
    let querySelect = "SELECT * FROM products";
	connection.query(querySelect, function(err, res){
        if(err) throw err;
        let displayTable = new Table ({
			head: ["Item ID", "Product Name", "Category", "Price", "Quantity"],
			colWidths: [10,25,25,10,14]
		});
        for(let i = 0; i < res.length; i++){
			
            if(res[i].stock_quantity <= 5){
		
                console.log("Low Inventory of " + res[i].product_name + ". Restock this product!");
                displayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            	);
		    };
        };
        console.log('*********************************');
	    console.log('*     LOW INVENTORY PRODUCTS    *');
	    console.log('*********************************');
		console.log(displayTable.toString());
		inquirer.prompt([{
			name:"action",
			type: "list",
			message: "Choose an option below to manage current inventory:",
			choices: ["View Products For Sale", "Update Product", "Add To Inventory", "Add New Product", "Remove Existing Product", "Exit"]
		}]).then(function(answers){
			switch(answers.action){
				case 'View Products For Sale':
					displayInventory();
					break;
				case 'Update Product':
					updateProduct();
					break;
				case 'Add To Inventory':
					restockRequest();
					break;
				case 'Add New Product':
					addNewProduct();
					break;
				case 'Remove Existing Product':
					removeProduct();
					break;
				case 'Exit':
					process.exit(22);
					break;		
			}
		});
	});
};

function restockRequest(){
	inquirer.prompt([
	{
		name:"ID",
		type:"input",
		message:"What is the ID number of the item you would like to restock?",
		validate: validateInteger
	},
	{
		name:"Quantity",
		type:"input",
        message:"What is the quantity you would like to add?",
        validate: validateInteger
	},
	]).then(function(answers){
		let quantityAdded = answers.Quantity;
		let productID= answers.ID;
		restockInventory(productID, quantityAdded);
	});
};

function restockInventory(id, quantity){
    connection.query(
        "SELECT * FROM products WHERE ?",
        {
			item_id: id 
        },
        function(err,res){
            if(err) throw err;
            let currentQty = res[0].stock_quantity;
            let currentID = res[0].item_id;
            let newStock_quantity = currentQty + parseInt(quantity);
            console.log('*********************************');
	        console.log('*        PRODUCT UPDATED        *');
	        console.log('*********************************');
            console.log("Current ID: " + currentID);
            console.log("Current Product: " + res[0].product_name);
            console.log("Current Qty: " + currentQty);
            console.log("New Stock Qty: " +newStock_quantity);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [{stock_quantity: newStock_quantity},{item_id: currentID}], 
                function(err, res) {
                    if (err) throw err;
                    // addHeader('CONTINUE SHOPPING...');
                    displayInventory();
                }
            );
        }
    );
};

function addNewProduct(){
	inquirer.prompt([

	{
		name: "Name",
		type: "input",
		message: "Please enter the new product name to add to the inventory?"
	},
	{
		name:"Department",
		type:"input",
		message:"Which department does the new product belong to?"
	},
	{
		name:"Price",
		type:"input",
		message:"What is the product price per unit?",
		validate: validateNumeric
	},
	{
		name:"Quantity",
		type:"input",
		message:"What is the quantity you would like to add?",
		validate: validateInteger
	},

	]).then(function(answers){
		let name = answers.Name;
		let department = answers.Department;
		let price = answers.Price;
		let quantity = answers.Quantity;
		console.log('\n Adding New Product: \n\n Product Name = ' + name + '\n' +  
									   ' Department = ' + department + '\n' +  
									   ' Price = ' + parseFloat(price) + '\n' +  
									   ' Quantity = ' + quantity);
		buildNewProduct(name,department,price,quantity); 
	});
	displayInventory();
  };

  function buildNewProduct(name,department,price,quantity){
	  // Create the insertion query string
	// Add new product to the db
		connection.query(
			"INSERT INTO products SET ?",
			{
				product_name: name,
				department_name: department,
				price: price,
				stock_quantity: quantity
			},
			function (error, res) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + res.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");
			// End the database connection
			// connection.end();
		});
		
  };

  function removeProduct(){
	inquirer.prompt([{
		name:"ID",
		type:"input",
		message:"Enter the item number of the product you would like to remove?"
	}]).then(function(answer){
		let id = answer.ID;
		removeInventory(id); 
	});
};

function removeInventory(id){
	connection.query(
		"SELECT * FROM products WHERE ?", 
		{
			item_id: id	
		},
		function(err, res){
			if(err) throw err;
			inquirer.prompt({
                name: 'confirm',
                type: 'confirm',
				message: `You would like to delete ` + res[0].product_name + `. Is this correct?`
			}).then(function(answer){
                if (answer.confirm) {
                    connection.query('DELETE FROM products WHERE ?', { item_id: res[0].item_id }, function(err, res){
                        if (err) throw err;
                        console.log('\n\tItem successfully removed!');
                        displayInventory();
                    });
                } else {
                    removeProduct();
                }
            });
			
		}
	);
};


function managerInquirer(){
	inquirer.prompt([{
		name:"action",
		type: "list",
		message: "Choose an option below to manage current inventory:",
		choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Remove Existing Product", "Exit"]
	}]).then(function(answers){
		switch(answers.action){
            case 'View Products For Sale':
                displayInventory();
                break;
            case 'View Low Inventory':
				lowRequest();
				break;
			case 'Add To Inventory':
				restockRequest();
				break;
			case 'Add New Product':
				addNewProduct();
				break;
			case 'Remove Existing Product':
				removeProduct();
				break;	
			case 'Exit':
				console.log('Bye!');
				process.exit(22);
				break;		
		}
	});
};

