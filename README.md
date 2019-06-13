# Bamazon-App
This is an Amazon-like storefront. The app takes in orders from customers and deplete stock from the store's inventory.

The app is connected with a MySQL Database called `bamazon_db` which holds a table called `products` with all the products available for sale.

This app is made up of three different Node apps interconnected to each other. These modules are `bamazonCustomer.js`, `bamazonManager.js`, and `bamazonSupervisor.js`.

In this assigment we are only covering the app `bamazonCustomer.js`. This app will first display a banner with the name of the store and a slogan, and right after a table with all the items available for sale, and a prompt to the users by asking them to enter ID and quantity of the product they want to buy like shown here below:

![Results](/screenshots/bamazonCustomer-purchase.JPG)


If the ID entered was not a valid non-zero whole number or no such ID was found in the database, it will display error messages and will prompt the questions again.

![Results](/screenshots/bamazonCustomer-non-valid-id.JPG)  

![Results](/screenshots/bamazonCustomer-item-not-found.JPG)

![Results](/screenshots/bamazonCustomer-purchase-successful.JPG)

Once the customer has placed the order, the application checks if your store has enough of the product to meet the customer's request. If so, the app notifies the customer that their order is in stock, then it processes the customer's order, and shows the customer the product purchased and the total cost of their purchase. Then thanks customer for their purchase and advises the time for delivery. 

![Results](/screenshots/bamazonCustomer-inventory-updated.JPG)



