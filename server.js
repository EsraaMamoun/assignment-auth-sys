const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 4000;


app.listen(4000, () => console.log(`App running on ${port}`));