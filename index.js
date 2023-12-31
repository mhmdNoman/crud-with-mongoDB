import express, { json } from "express";
import cors from "cors";
import { CURSOR_FLAGS, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());

const uri =
  "mongodb+srv://mhmdnoman01:HCMHm8pOkD9lcLgc@cluster0.vpubwbo.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("usersDB");
    const userCollecton = database.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollecton.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollecton.findOne(query);
      res.send(user);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const result = await userCollecton.insertOne(user);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log("id", user);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };

      const result = await userCollecton.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("please delete from data base", id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollecton.deleteOne(query);
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
