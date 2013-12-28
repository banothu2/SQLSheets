var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql2');
var verbose = process.env.NODE_ENV != 'test'

// ---------- App Configuration
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({ secret: 'God Of War' }));
        app.use(express.methodOverride());
        //app.use(flash());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));

    });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    //app.engine('html', require('ejs').renderFile);

/* App.map set up start */
  app.map = function(a, route){
    route = route || '';
    for (var key in a) {
      switch (typeof a[key]) {
        // { '/path': { ... }}
        case 'object':
          app.map(a[key], route + key);
          break;
        // get: function(){ ... }
        case 'function':
          if (verbose) console.log('%s %s', key, route);
          app[key](route, a[key]);
          break;
      }
    }
  };
/* App.map set up end */

/* public variables start */ 
  var connection;
/* public variables end */

/* map functions start */
  var init = {
    requestConnection: function(req, res){
        res.render('connection');
    }, 
    createConnection: function(req, res){
      var apple = 0;

      connection = mysql.createConnection({ 
          user: req.body.username, 
          host: req.body.hostname, 
          password: req.body.password
      });
      connection.connect(function(err) {
        // connected! (unless `err` is set)
        if(err){
          res.redirect('/');
        } else {
          connection.query('SHOW Databases', function(err, databaseList){
            connection.query('SELECT * FROM '+ databaseList[0].Database + '.TABLES',  function(err, tables){
              res.redirect('/connected/' + databaseList[0].Database + '/' + tables[0].TABLE_NAME );
            });
          });
        }
      });
    },
    connected: function(req, res){
      var toDatabase = req.params.toDatabase;
      var toTable = req.params.toTable;

      connection.query('SHOW Databases', function(err, databaseList){

          connection.query('USE ' + toDatabase);
          connection.query('SELECT * FROM information_schema.TABLES',  function(err, tables){

                  var tablesList = Object_keys(tables[0]);
                  function Object_keys(obj) {
                      var tablesList = [], name;
                      for (name in obj) {
                          if (obj.hasOwnProperty(name)) {
                              tablesList.push(name);
                          }
                      }
                      return tablesList;
                  }

            connection.query('SELECT * FROM '+ toTable, function(err, rows){

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

                res.render('users', {
                                      rows : rows,
                                      keys: keys, 
                                      databases: databaseList, 
                                      tables: tables,
                                      databaseName: toDatabase,
                                      tableName: toTable

                                    }
                );

            })


          });

      });
    }
  }


/*

var db_config = {
  host: 'engr-cpanel-mysql.engr.illinois.edu',
    user: 'banothu2_fuck',
    password: 'password!'
};

var connectionD;

function handleDisconnect() {
  connectionD = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connectionD.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connectionD.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
*/

/*
  var users = {
    list: function(req, res){
      res.send('user list');
    },

    get: function(req, res){
      res.send('user ' + req.params.uid);
    },

    del: function(req, res){
      res.send('delete users');
    }
  };

  var pets = {
    list: function(req, res){
      res.send('user ' + req.params.uid + '\'s pets');
    },

    del: function(req, res){
      res.send('delete ' + req.params.uid + '\'s pet ' + req.params.pid);
    }
  };
*/
/* map functions end */

/* map path start */
  app.map({
    '/': {
      get: init.requestConnection
    }, 
    '/connected/:toDatabase/:toTable': {
      get: init.connected,
      post: init.connected
    }, 
    '/request/createConnection': {
      post: init.createConnection
    }
  });
/* map path start */

/*
var connection = mysql.createConnection({ 
		user: 'banothu2_fuck', 
		host: 'engr-cpanel-mysql.engr.illinois.edu', 
		
		password: 'password!'
});
*/

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

app.get('/users', function(req, res){
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

app.get('/', function(req, res){
  res.render('connection');
});




app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));