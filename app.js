const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieparser = require("cookie-parser")
require('dotenv').config();
const cors = require("cors");
const app = express();

// mongoose.connect('mongodb+srv://vinus:vinus@cluster0.rpksm.mongodb.net/Reciply?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect('mongodb://localhost:27017/Reciply', { useUnifiedTopology: true, useNewUrlParser: true })

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieparser())
app.use(express.json())

app.use('/user', require('./routes/user'));
app.use('/avatar', require('./routes/avatar'));
app.use('/recipe', require('./routes/recipe'));
app.use('/ingredient', require('./routes/ingredient'));
app.use('/category', require('./routes/category'));
app.use("/comment", require('./routes/comment'));
app.use("/playlist", require('./routes/playlist'));
app.use("/channel", require('./routes/channel'));

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;   