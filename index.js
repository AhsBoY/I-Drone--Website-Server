const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId


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
        const dronesInfo = database.collection("droneInfo")
        const ordersInfo = database.collection("ordersInfo")
        const usersInfo = database.collection("usersInfo")

        app.get("/drone", async (req, res) => {
            const query = dronesInfo.find({})
            const result = await query.toArray()
            // console.log(result)
            res.json(result)
        })
        app.get("/drone/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await dronesInfo.findOne(query)
            // console.log(result)
            res.json(result)
        })

        app.post("/drone", async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await dronesInfo.insertOne(user)
            res.json(result)
        })
        app.delete("/drone/:id", async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await dronesInfo.deleteOne(query)
            res.json(result)
        })

        app.post("/orders", async (req, res) => {
            const data = req.body
            // console.log(data)
            const result = await ordersInfo.insertOne(data)
            res.json(result)
        })
        app.get("/orders/:id", async (req, res) => {
            const email = req.params.id
            const query = { email: email }
            const cursor = ordersInfo.find(query)
            const result = await cursor.toArray()
            // console.log(result)
            res.json(result)
        })
        app.get("/orders", async (req, res) => {
            const query = ordersInfo.find({})
            const result = await query.toArray()
            res.json(result)
        })

        // My Orders
        app.delete("/order/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersInfo.deleteOne(query)
            res.json(result)
        })
        // Manage All Orders
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id
            // console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await ordersInfo.deleteOne(query)
            res.json(result)
        })
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id
            const orderStatus = req.body
            console.log(req.body)
            // console.log(id, updateInfo)
            const filter = { _id: ObjectId(id) }
            // const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: orderStatus[0].status
                }
            }
            const result = await ordersInfo.updateOne(filter, updateDoc)
            // console.log(orderStatus)
            res.json(result)
        })


        app.post("/users", async (req, res) => {
            const user = req.body
            // console.log(user)
            const result = await usersInfo.insertOne(user)
            res.json(result)
        })

        app.put("/users/admin", async (req, res) => {
            const user = req.body
            const filter = { email: user.email }
            const updateDoc = { $set: { role: "Admin" } }
            const result = await usersInfo.updateOne(filter, updateDoc)
            console.log(result)
            res.json(result)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await usersInfo.findOne(query)
            let isAdmin = false
            if (user?.role === "Admin") {
                isAdmin = true
            }
            console.log({ admin: isAdmin })
            res.json({ admin: isAdmin })
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