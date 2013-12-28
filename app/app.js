var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql2');
var verbose = process.env.NODE_ENV != 'test'
//var     , survey = require('./routes/survey')


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

/* public variables end */

/* map functions start */

/* map functions end */

/* map path start */

  app.map({
      '/': {
        get: function(req, res){
            res.render('users')
          }
      }
      //'/surveys': {
      //  get: survey.findAll,
  });

/* map path start */




app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));