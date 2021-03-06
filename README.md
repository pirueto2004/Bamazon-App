# Bamazon-App
This is an Amazon-like storefront built with Node.js and Mysql. The app takes in orders from customers and deplete stock from the store's inventory.

The app is connected with a MySQL Database called `bamazon_db` which holds a table called `products` with all the products available for sale.

This app is made up of three different Node modules interconnected to each other. These modules are `bamazonCustomer.js`, `bamazonManager.js`, and `bamazonSupervisor.js`.

## Module `bamazonCustomer.js`: Customer View. 

This app will first display a banner with the name of the store and a slogan, and right after shows a table with all the items available for sale, and a purchase prompt to the users by asking them to enter ID and quantity of the product they want to buy like shown here below:

![Results](/screenshots/bamazonCustomer-purchase.JPG)


If the ID entered was not a valid non-zero whole number or no such ID was found in the database, it will display error messages and will prompt the questions again.

![Results](/screenshots/bamazonCustomer-non-valid-id.JPG)  

![Results](/screenshots/bamazonCustomer-item-not-found.JPG)

![Results](/screenshots/bamazonCustomer-purchase3.JPG)

Once the customer has placed the order, the application checks if your store has enough of the product to meet the customer's request. 
If the requested amount is over the stock quantity of the product, then the customer is notified and asked if they want to purchase the available amount of the desired item. If customer agrees then the order is processed for the total amount in stock. If the customer decides not to purchase anything then they can exit the app, otherwise they can continue shopping.

![Results](/screenshots/bamazonCustomer-insufficient-amount.JPG)

If we can meet the customer's request, the app notifies the customer that their order is in stock, then it processes the customer's order, and shows the customer the product purchased and the total cost of their purchase. Then thanks customer for their purchase and advises the time for delivery. 

![Results](/screenshots/bamazonCustomer-inventory-updated3.JPG)

## Module `bamazonManager.js`: Manager View. 

Running this application will list a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

    * Remove Existing Product

If a manager selects `View Products for Sale`, the app displays a table with the list of every available item: the item IDs, names, prices, quantities, and product sales.

![Results](/screenshots/bamazonManager-view-inventory.JPG)

If a manager selects `View Low Inventory`, then the app lists all items with an inventory count equal or lower than five. Then the manager can restock such items.

![Results](/screenshots/bamazonManager-low-inventory-and-updating.JPG)

After replenishing the items, the app lists the inventory updated.

![Results](/screenshots/bamazonManager-low-inventory-updated.JPG)

If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

![Results](/screenshots/bamazonManager-adding-new-item.JPG)

After adding the new product, the app lists the inventory updated.

![Results](/screenshots/bamazonManager-inventory-after-adding-item.JPG)


## Module `bamazonSupervisor.js`: Supervisor View. 

Running this application will first display a table with all the products for sale and right after a set of menu options:
   
   * View All Departments

   * View Product Sales by Department
   
   * Create New Department

![Results](/screenshots/bamazonSupervisor-view.JPG)

For this module, a new table called `departments` was created. We used the mysql JOIN Clause to combine tables products and departments based on the department_name column. This table includes the following columns:

   * department_id

   * department_name

   * over_head_costs

When a supervisor selects `View Product Sales by Department`, the app displays a summarized table in their terminal/bash window as the following:

![Results](/screenshots/bamazonSupervisor-view2.JPG)

If supervisor selects `Create New Department`, the app prompts to input the data:

![Results](/screenshots/bamazonSupervisor-new-dept.JPG)

To view a list of all of the Departments available:

![Results](/screenshots/bamazonSupervisor-view-departments.JPG)



