import express from 'express';
import { cartItems as cartItemsRaw, products as productsRaw } from './temp-data';

let cartItems = cartItemsRaw;
let products = productsRaw;


const app = express();

app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello!');
})

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/cart', (req, res) => {
  res.json(cartItems);
});

app.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const product = products.find(product => product.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// app.post('/addToCart', (req, res) => {
//   // Find the item in our list of items by its id
//   const itemInList = products.find(item => item.id == req.body.id);

//   // If we didn't  find an item with that id then send back a 400 error
//   if (!itemInList) {
//     return res.status(400).json({ message: "Item not found!" });
//   }

//   let quantity = req.body.quantity || 1;

//   // Add the new item to the  end of our array for now
//   // We will talk about doing this more efficiently in class
//   cartItems.push({ ...itemInList, quantity: quantity });

//   res.status(201).json(cartItems[cartItems.length - 1]);
// });

// // Make sure you understand what is happening here before moving on
// app.delete("/removeFromCart", (req, res) => {
//   const index = cartItems.findIndex(i => i.id === req.body.id);

//   if (index === -1) {
//     return res.status(400).json({ message: 'ID not found' })
//   }

//   // Remove the item from the array
//   cartItems.splice(index, 1);

//   res.status(200).json(cartItems);
// })

// function calculateTotal(items) {
//   return items.reduce((total, item) => total + (item.price * item.quantity), 0)
// }

// app.post( "/checkout", (req, res) =>  {
//   const showSummary = () => res.status(200).json(cartItems.map(i => ({...i, price: i.price * i.quantity})) );

//   // If there are no items in the user's shopping cart then display a summary of their empty shopping cart
//   if (cartItems.length ===  0) return showSummary();

//   const donePaying = () => {
//     // Reset the users shopping cart
//     cartItems.length=0;

//     // Display a payment processing page or a receipt of some sort perhaps?
//     res.status(200).send('Thank You For Your Purchase!');
//   };

//   // Calculate how much the customer owes and pass that amount along with the function to display the purchase summary when ready to pay

// });

// app.get('/cart', (req, res) => {
//   res.json({ items: cartItems, total: calculateTotal(cartItems) });
// });



app.post('/cart', (req, res) => {
  const productId = req.body.id;
  const product = products.find(product => product.id === productId);
  cartItems.push(product);
  res.json(cartItems);
})

app.delete('/cart/:productId', (req, res) => {
  const productId = req.params.productId;
  cartItems = cartItems.filter(product => product.id !== productId);
  res.json(cartItems);
})


app.listen(8000, () => {
  console.log(new Date(), "Server is running on port  8000");
})