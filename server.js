const express = require('express');
const app = express();
const controllers = require('./controllers');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");


const PORT = 4000;


app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.send("index");
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride("_method"));

app.use('/store', controllers.store);
app.use('/product', controllers.product);


app.listen(PORT, function(){
    console.log("Express up and running...");
});