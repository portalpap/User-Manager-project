const exp = require('constants');
const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({urlencoded:false}))
app.use(express.json());

const port = 3000;
users = [];

