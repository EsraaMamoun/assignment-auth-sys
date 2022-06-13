const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const port = process.env.PORT || 4000;


const authRoute = require('./routes/auth');

mongoose.connect(process.env.DB_CONNECT, () => console.log('conected to db!'));

app.use(express.json());

app.use('/api/user', authRoute);


app.listen(port, () => console.log(`App running on ${port}`));