const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x6cmvy8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db("toysDB").collection("toys");
    const userCollection = client.db("userDB").collection("users");
    const cartCollection = client.db("cartDB").collection("carts");
    const brandCollection = client.db("brandDB").collection("brands");
    //toys Get
    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Toys Post

    app.post("/toys", async (req, res) => {
      const newToy = req.body;

      const result = await toysCollection.insertOne(newToy);
      res.send(result);
    });

    //Toys Update

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToys = req.body;
      const toy = {
        $set: {
          productImage: updateToys.productImage,
          productName: updateToys.productName,
          brand: updateToys.brand,
          price: updateToys.price,
          category: updateToys.category,
          rating: updateToys.rating,
          description: updateToys.description,
        },
      };
      const result = await toysCollection.updateOne(filter, toy, options);
      res.send(result);
    });

    // toy id get

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // toys brand get

    app.get("/toysBrand/:id", async (req, res) => {
      const brandName = req.params.id;
      const result = await toysCollection.find({ brand: brandName }).toArray();

      res.send(result);
    });
    app.get("/brand/:id", async (req, res) => {
      const brandName = req.params.id;
      const result = await brandCollection
        .find({ brandName: brandName })
        .toArray();

      res.send(result);
    });

    //brand post
    app.post("/brand", async (req, res) => {
      const brand = req.body;

      const result = await brandCollection.insertOne(brand);
      res.send(result);
    });

    //Brand Get

    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // user post

    app.post("/user", async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //users get

    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // user cart post

    app.post("/cart", async (req, res) => {
      const cartProduct = req.body;

      const result = await cartCollection.insertOne(cartProduct);

      res.send(result);
    });

    // user cart get

    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const result = await cartCollection.find({ userId: id }).toArray();

      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use((err, req, res, next) => {
  if (err.message) {
    res.status(500).send(err.message);
  } else {
    res.send("This Already Added");
  }
});

app.get("/", (req, res) => {
  res.send("Baby Toys Server is Running");
});

app.listen(port, () => {
  console.log(`Baby toys server on this port: ${port}`);
});
