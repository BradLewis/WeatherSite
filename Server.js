var express=require('express');
var app=express();
var mysql=require('mysql');
var fs = require('fs');

var data = fs.readFileSync('creds.txt', 'utf8');

//very hacky, will fix later
var user = data.split(",")[0].replace("\"","").replace("\"","");
var pass = data.split(",")[1].replace("\"","").replace("\"","");

app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var connection = mysql.createConnection({
    host : 'localhost',
    user : user,
    password : "",
    database : 'test_database'
});
connection.connect();

app.get('/',function(req,res){
    res.render('index.html');
});

app.get('/search',function(req,res){
    connection.query('SELECT first_name FROM user_name WHERE first_name like "%'+req.query.key+'%"',
    function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++) {
            data.push(rows[i].first_name);
        }
        res.end(JSON.stringify(data));
    });
});

var server=app.listen(3000,function(){
    console.log("We have started our server on port 3000");
});