const express = require('express');
const app = express();
const controllers = require('./controllers');


const PORT = 4000;


app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.send("index");
})

app.use('/store', controllers.store);


app.listen(PORT, function(){
    console.log("Express up and running...");
});