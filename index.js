const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bocayyh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const gadgetCollection = client.db('gadgetDB').collection('gadget')
    const cartCollection = client.db('gadgetDB').collection('cart')

    app.get("/gadget", async (req, res) => {
      const cursor = gadgetCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get("/gadget/:brand", async (req, res) => {
      const brand = req.params.brand;
      const products = await gadgetCollection.find({ brand: brand }).toArray();
      res.json(products);
    });


    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // app.get("/gadget/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) }
    //   const result = await gadgetCollection.findOne(query);
    //   res.send(result);
    // });


    app.post("/gadget", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await gadgetCollection.insertOne(newProduct);
      res.send(result);
    })

    app.post("/cart", async (req, res) => {
      const cartProduct = req.body;
      console.log(cartProduct);
      const result = await cartCollection.insertOne(cartProduct);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('gadget galaxy server is running')
})

app.listen(port, () => {
  console.log(`Gadget Galaxy server is running form port ${port}`);
})