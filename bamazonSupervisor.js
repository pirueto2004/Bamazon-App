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
    // supervisorInquirer();
});

function addHeader(text){
	figlet(text, {font: 'Standard', horizontalLayout: 'full'}, function(err, data) {
		if (err) {
			console.log(error('Something went wrong...'));
			console.dir(err);
			return;
		}
		console.log(data)
		console.log(bgCyan('**********************************************'));
		console.log(bgCyan('*            SUPERVISOR DASHBOARD            *'));
		console.log(bgCyan('**********************************************'));
    displayInventory();
    
	});
	
};

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
        [res[i].item_id,res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity, parseFloat(res[i].product_sales).toFixed(2)]
        );
    }
    console.log(displayTable.toString());
    supervisorInquirer();
    
  });
};

//view product sales by department
function viewSalesByDept(){
    //prints the items for sale and their details
    let query = "SELECT departments.department_id , departments.department_name , departments.over_head_costs, products.product_sales FROM departments ,products WHERE departments.department_name = products.department_name GROUP BY department_id";
    connection.query(query, function(err, res){
      if(err) throw err;
      console.log('\n*******************************************');
	    console.log('*       Product Sales by Department       *');
	    console.log('*******************************************\n');
      let displayTable = new Table ({
        head: ["Dept ID", "Dept Name", "Over Head Costs", "Product Sales", "Total Profit"],
        colWidths: [10,50,30,15,15]
      });
      for(let i = 0; i < res.length; i++){
          displayTable.push(
            [res[i].department_id,res[i].department_name, parseFloat(res[i].over_head_costs).toFixed(2), parseFloat(res[i].product_sales).toFixed(2), parseFloat(res[i].product_sales - res[i].over_head_costs).toFixed(2)]);
            // console.log(res[i]);
      }
      console.log(displayTable.toString());
      inquirer.prompt([{
        name:"action",
        type: "list",
        message: "Choose an option below to manage current inventory:",
        choices: ["Create New Department", "Exit"]
      }]).then(function(answers){
        switch(answers.action){
                case 'Create New Department':
                    createDepartment();
                    break;
                case 'Exit':
                    console.log('Bye!');
                    process.exit(22);
                    break;		
        }
      });
    });
    
  };

function createDepartment(){
  inquirer.prompt([
    {
      name: "ID",
      type: "input",
      message: "Please enter the ID for the new department?"
    },
    {
      name: "Department",
      type: "input",
      message: "Please enter the new department name to add to the database?"
    },
    {
      name:"Costs",
      type:"input",
      message:"How much is the Over Head Costs of this department?",
      validate: validateNumeric
    },
      
    ]).then(function(answers){
      let id = answers.ID;
      let department = answers.Department;
      let costs = answers.Costs;
      
      console.log('\n Adding New Department: \n\n Department = ' + department + '\n' +  
                       ' Over Head Costs = ' + parseFloat(costs).toFixed(2) + '\n');
      buildNewDept(id, department,costs); 
    });
    // displayInventory();
    
};

function buildNewDept(id, dept, costs){
    // Create the insertion query string
	// Add new product to the db
  let default_sales = 0;
  
  connection.query(
    "INSERT INTO departments SET ?",
    {
      department_id: id,
      department_name: dept,
      over_head_costs: costs,
      department_sales: default_sales
      
    },
    function (error, res) {
    if (error) throw error;

    console.log('New department has been added to the database under ID ' + res.insertId + '.');
    console.log("\n---------------------------------------------------------------------\n");
    // End the database connection
    // connection.end();
  });
  viewSalesByDept();
};

function supervisorInquirer(){
	inquirer.prompt([{
		name:"action",
		type: "list",
		message: "Choose an option below to manage current inventory:",
		choices: ["View Product Sales by Department", "Create New Department", "Exit"]
	}]).then(function(answers){
		switch(answers.action){
            case 'View Product Sales by Department':
                viewSalesByDept();
                break;
            case 'Create New Department':
                createDepartment();
                break;
			      case 'Exit':
                console.log('Bye!');
				        process.exit(22);
				        break;		
		}
	});
};

