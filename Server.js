var express = require('express');
var app = express();
var mysql = require('mysql');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//Opens the credentials file that stores api key and mysql logins etc
var data = fs.readFileSync('creds.txt', 'utf8');

var user = data.split(";")[0].replace("\"","").replace("\"","");
var pass = data.split(";")[1].replace("\"","").replace("\"","");
var api_key = data.split(";")[2].replace("\"","").replace("\"","");
var database_name = data.split(";")[3].replace("\"","").replace("\"","");

app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Connect to mysql database
var connection = mysql.createConnection({
    host : 'localhost',
    user : user,
    password : pass,
    database : database_name
});
connection.connect();

app.get('/',function(req,res){
    res.render('index.html');
});

//searches for city id
app.get('/search',function(req,res){
    connection.query('SELECT name, country FROM city_list WHERE name like "%'+req.query.key+'%" LIMIT 20',
    function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++) {
            data.push(rows[i].name + ", " + rows[i].country);
        }
        res.end(JSON.stringify(data));
    });
});

app.get('/city', function(req,res) {
    var cityCountry = req.query.key;
    cityCountry = cityCountry.split(", ");
    connection.query('SELECT _id FROM city_list WHERE name = "'+cityCountry[0]+'" AND country = "'+cityCountry[1] + '" LIMIT 1',
    function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++) {
            data.push(rows[i]._id);
        }
        //gets the city id from the sql query
        city_id = JSON.stringify(data).replace("[","").replace("]","");
        //api call
        var requestString = "http://api.openweathermap.org/data/2.5/weather?id="
                            + city_id
                            + "&cluster=yes&format=json"
                            + "&APPID=" + api_key;
        request = new XMLHttpRequest();
        request.onload = function(){
            //onload send info to frontend
            res.json(this.responseText);
        }
        request.open("get", requestString, true);
        request.send();
    });
});

//JS file that handles events
app.get('/JS/events.js', function(req,res) {
    res.sendFile(__dirname + '/JS/events.js');
});


var server=app.listen(3000,function(){
    console.log("We have started our server on port 3000");
});
