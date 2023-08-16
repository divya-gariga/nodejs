const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const candidateRoutes = require('./routes/candidate');
const courtsearchRoutes = require('./routes/courtsearch');

const app = express();

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/candidates', candidateRoutes);
app.use('/courtsearches', courtsearchRoutes);


mongoose
.connect(
    'mongodb+srv://divyag20:divyag20@cluster0.qbrwldo.mongodb.net/checkr?retryWrites=true'
)
.then(result => {
  app.listen(8080);
})
.catch(err => console.log("error",err));
