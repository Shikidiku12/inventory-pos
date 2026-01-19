const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const items = require('./routes/items');
const dashboard = require('./routes/dashboard')
const sales = require('./routes/sales')
const errorHandler = require('./middleware/errorHandler');

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use('/api/items', items);
app.use('/api/sale', sales);
app.use('/api/dashboard', dashboard)

app.use(errorHandler)

const port = process.env.PORT;

app.listen(port, ()=>{console.log(`App is listening to port ${port}`)})