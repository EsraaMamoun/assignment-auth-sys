const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const port = process.env.PORT || 4000;


const authRoute = require('./routes/auth');
const weatherRoute = require('./routes/weather');
const passReset = require('./routes/resetPassword');

mongoose.connect(process.env.DB_CONNECT, () => console.log('conected to db!'));

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api', weatherRoute);
app.use('/api/password/reset', passReset);

app.listen(port, () => console.log(`App running on ${port}`));