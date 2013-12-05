var express = require('express');
var path = require('path');
var app = express();
var mysql      = require('mysql2');



var connection = mysql.createConnection({ 
		user: 'banothu2_fuck', 
		host: 'engr-cpanel-mysql.engr.illinois.edu', 
		
		password: 'password!'
});

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/createTable', function(req, res){
	connection.query('CREATE TABLE test (columnOne varchar(255), columnTwo varchar(255));', function(err, response){
		console.log("creating table");
		res.redirect('/insert');
	});

})			

app.get('/insert', function(req, res){
  connection.query('INSERT INTO test(columnOne, columnTwo) VALUES ("hello", "bye")', function(err, rows){
  	res.redirect('/')
  });
});

app.get('/', function(req, res){
  connection.query('USE banothu2_hw2');
  connection.query('SELECT * FROM countries', function(err, rows){

        var keys = Object_keys(rows[0]);
        function Object_keys(obj) {
            var keys = [], name;
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        }

	console.log(keys)
  	console.log(rows);
    res.render('users', {users : rows, keys: keys});
  });
});


app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));