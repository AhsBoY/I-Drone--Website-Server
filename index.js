const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5tec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("iDrone")
        const droneInfo = database.collection("droneInfo")

        // app.post("/drone", async (req, res) => {
        //     const doc = { name: "Ahsan" }
        //     const result = await droneInfo.insertOne(doc)
        //     res.json(result)
        // })
        app.get("/drone", async (req, res) => {
            const query = droneInfo.find({})
            const result = await query.toArray()
            console.log(result)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(port, () => {
    console.log(`Listening From ${port}`)
})