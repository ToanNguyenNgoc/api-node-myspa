const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv')
const morgan = require('morgan')
var bodyParser = require('body-parser')
const cors = require('cors')

const bannersTypeRoute = require('./router/bannersTypeRoute')
const bannersRoute = require('./router/bannersRoute')

dotenv.config();
mongoose.connect((process.env.MONGO_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(bodyParser.json({ limit: "50mb" }))
app.use(cors())
app.use(morgan("common"))

// ROUTER
app.use("/v1/banners_type", bannersTypeRoute)
app.use("/v1/banners", bannersRoute)

// app.get('/api', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})