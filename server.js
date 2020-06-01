const express = require('express');
const app = express();
const controllers = require('./controllers');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


const PORT = 4000;


app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.send("index");
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride("_method"));

app.use(
    session({
        store: new MongoStore ({
            url: 'mongodb://localhost:27017/store'
        }),
        secret: "Secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 2
        },
    })
);

app.use('/', controllers.auth);
app.use('/store', controllers.store);
app.use('/product', controllers.product);



app.listen(PORT, function(){
    console.log("Express up and running...");
});