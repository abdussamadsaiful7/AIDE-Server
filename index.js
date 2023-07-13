const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5050;

//middleWare
app.use(cors());
app.use(express.json());

//console.log(process.env.AIDE_PASS)

const uri = `mongodb+srv://${process.env.AIDE_USER}:${process.env.AIDE_PASS}@cluster0.nrvy6gz.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
      //  await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Aide project is running")
})

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
})