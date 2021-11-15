const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9lid.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("Niche's Database Connected");
        const database = client.db("Niche_product");
        const productsCollection = database.collection("Products");
        const orderedCollection = database.collection("Orders");
        const adminsCollection = database.collection("Admins");
        const reviewCollection = database.collection("Review");


        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const products = await cursor.toArray();
            res.json(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        })



        // orders..............
        
        app.get('/orders/all', async (req, res) => {
            const cursor = orderedCollection.find({});
            const orderedProduct = await cursor.toArray();
            res.json(orderedProduct);
        })

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderedCollection.find(query);
            const orderedProduct = await cursor.toArray();
            res.json(orderedProduct);
        })

        app.post('/orders', async (req, res) => {
            const orderedProduct = req.body;
            const result = await orderedCollection.insertOne(orderedProduct);
            res.json(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderedCollection.deleteOne(query);
            res.json(result);
        })

        //Admin
        app.post('/admin', async (req, res) => {
            const admin = req.body;
            const result = await adminsCollection.insertOne(admin);
            res.json(result);
        })

        app.get('/admin', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const admin = adminsCollection.find(query);
            const result = await admin.toArray();
            res.json(result);
        })

        //review...........
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        })
        app.post('/review', async (req, res) => {
            const rating = req.body;
            const result = await reviewCollection.insertOne(rating);
            res.json(result);
        })
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const rating = await cursor.toArray();
            res.json(rating);
        })

    }
    finally {
        // await clint.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Niche web')
})


app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})