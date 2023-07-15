const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
       // await client.connect();

        const productsCollection = client.db('aidreDB').collection('products');
        const allEmployeeCollection = client.db('aidreDB').collection('allEmployee');
        const orderCollection = client.db('aidreDB').collection('order');

        app.get('/products', async(req, res)=>{
            const cursor =  productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        //order
        app.get('/order', async(req, res)=>{
            const cursor =  orderCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // app.post('/order', async(req, res)=>{
        //     const newOrder = req.body;
        //     const result = await orderCollection.insertOne(newOrder);
        //     res.send(result);
        // })

        app.post('/order', async (req, res) => {
            const newOrder = req.body;
            newOrder.totalPrice = newOrder.price * newOrder.quantity; // Calculate totalPrice
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
          });
          

        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })

        //employee
        app.get('/allEmployee', async(req, res)=>{
            const cursor =  allEmployeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/allEmployee', async (req, res) => {
            const newEmployee = req.body;
            const result = await allEmployeeCollection.insertOne(newEmployee);
            res.send(result);
        })


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