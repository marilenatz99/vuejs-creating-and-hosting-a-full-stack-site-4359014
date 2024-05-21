import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';

async function start() {

  const client = new MongoClient(`mongodb+srv://fsv-server:12345@cluster0.fusrma3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

  await client.connect();
  const db = client.db('fsv-db');

  const app = express();
  app.use(express.json());
  
  app.use('/images', express.static(path.join(__dirname, '../assets')));

  app.get('/api/products', async (req, res) => {
    const products = await db.collection('products').find({}).toArray();
    res.send(products);
  });

  app.get('/api/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection('products').findOne({ id: productId });
    res.json(product);
  });

  async function populateCartIds(ids) {
    return Promise.all(ids.map(id => db.collection('products').findOne({ id })));
  }

  app.get('/api/users/:userId/cart', async (req, res) => {
    const user = await db.collection('users').findOne({ id: req.params.userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  });

  app.post('/api/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    await db.collection('users').updateOne({ id: userId }, {
      $addToSet: { cartItems: productId } // addToSet is similar to push, but doesn't allow dublicates
    })

    const user = await db.collection('users').findOne({ id: userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  })

  app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    await db.collection('users').updateOne({ id: userId }, {
      $pull: { cartItems: productId } // pull removes the specific item from the array if it exists
    });

    const user = await db.collection('users').findOne({ id: userId });
    const populatedCart = await populateCartIds(user.cartItems);
    res.json(populatedCart);
  })


  app.listen(8000, () => {
    console.log(new Date(), "Server is running on port  8000");
  })
}

start();