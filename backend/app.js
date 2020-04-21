const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require("./models/post");
const Router = require("./routes/posts");

// addind express route, to handle request for a single path
const app = express();
const Post = require('./models/post');

mongoose.connect("mongodb+srv://Angad:hitlerismybitch@cluster-1fmzo.mongodb.net/node-angular?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected Sucessfully to MongoDB');
    })
    .catch(() => {
        console.log("Connection Failed to MongoDB");
    });
// here the connect() is function joining our cluster
// and node-angular is the name of our database
// collection name will be the lowercase plural of our model name 
// (here, model name is 'Post', so collection name will be 'posts')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
// app.use("/images", express.static("../images"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Append, Delete, Entries, Foreach, Get, Has, Keys, Set, Values, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS, PUT"
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// app.use("/api/posts", postsRoutes);
app.use("/api/posts", Router);

// wiring up the express to the server
// exporting app 
module.exports = app;
