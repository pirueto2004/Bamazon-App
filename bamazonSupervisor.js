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
    supervisorInquirer();
});

//view product sales by department
function viewSalesByDept(){
    //prints the items for sale and their details
    connection.query('SELECT * FROM Departments', function(err, res){
      if(err) throw err;
      console.log('>>>>>>Product Sales by Department<<<<<<');
      console.log('----------------------------------------------------------------------------------------------------')
      let displayTable = new Table ({
        head: ["Dept ID", "Dept Name", "Over Head Costs", "Product Sales", "Total Profit"],
        colWidths: [10,50,30,15,15]
    });
     for(let i = 0; i < res.length; i++){
        displayTable.push(
            [res[i].department_id,res[i].department_name, res[i].over_head_costs, res[i].product_sales, (res[i].over_head_costs -  res[i].product_sales)]
            );
      }
      console.log(displayTable.toString());
    });
  }

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