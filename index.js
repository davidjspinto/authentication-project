const express = require("express")
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//import Routes
const authRoute = require('./routes/auth');

dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => 
    console.log('connected to db')
);

//Midleware
app.use(express.json());


//Route Middlewares
app.use('/api/user', authRoute);


app.listen(4000, () => console.log("Server is running"));