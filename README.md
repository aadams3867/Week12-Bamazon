# Week12-Bamazon

### Customer View

I created a MySQL Database called "bamazon" and a table called "products".

![Pic of DB and Table creation](/images/1-Table_Creation.PNG)

As required, the ItemID column is the Primary Key for the table.

![Pic of ItemID as PK](/images/2-ItemID_is_PK.PNG)

Then I added 10 products to the database table.

![Pic of Populated Table](/images/3-Populated_db.PNG)

I ran BamazonCustomer.js and tried to buy too many of one product.

![Pic of BamazonCustomer.js with Insufficient Qty](/images/4-Bamazon_with_Insuff_Qty.PNG)

I bought 10 of another item, and I got a receipt showing my purchase.
The database updated the correct purchase order, but not the incorrect one.

![Pic of Completed Order and DB Update](/images/5-Order_Complete.PNG)

**Note:** I added some extra user input validation.  If you try to type in 
an ItemID or quantity to purchase that are **not** valid numbers
(letters, negative number, 0, too large number), then it won't be accepted.