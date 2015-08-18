var express = require("express");
var db = require('pg');
var bodyParser = require("body-parser");

var server = express();
var parseJson = bodyParser.json();
var port = 7777;

// var connectionstring = "postgres://<account>:<password>@<ip>:<port>/<database>";
// var connectionstring = "postgres://john:doe@127.0.0.1:5432/testdatabase";

/* CORS to allow cross domain references*/
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

server.get('/api', function(req, res) {
    res.send('hello nerdlandia api');
});
// used to display all active players
server.get('/api/players', function(req, res) {
    db.connect(connectionstring, function (err, client, done) {
        client.query("select userid, name, email, salary, signdate,comments from players where deletedate is null order by salary", [], function(errqry, result) {
            done();

            if (errqry) {
                console.log('get error running query: ', errqry);
            } else {
                res.json(result.rows);
            }

        });
    });
});
// used to populate a form for an existing player
server.get('/api/players/:id', function (req, res) {
    db.connect(connectionstring, function (err, client, done) {
        client.query("select userid, name, email, salary, signdate,comments from players where userid="+req.params.id, [], function (errqry, result) {
            done();
            
            if (errqry) {
                console.log('get error running query: ', errqry);
            } else {
                res.json(result.rows);
            }

        });
    });
});
// used to delete an existing player
server.delete('/api/players/:id', function (req, res) {
    db.connect(connectionstring, function (err, client, done) {
        client.query("update players set deletedate=NOW() where userid =" + req.params.id, [], function (errqry, result) {
            done();
            
            if (errqry) {
                console.log('get error running query: ', errqry);
            } else {
                res.json(result.rows);
            }

        });
    });
});
// used to add a new player
server.post('/api/players', parseJson, function (req, res) {
    console.log('req.body: ', req.body);
    var name = req.body[0].name;
    var email = req.body[0].email;
    var signdate = req.body[0].signdate;
    var salary = req.body[0].salary;
    var comments = req.body[0].comments;
    var sql = "INSERT INTO players(name, email, salary, signdate, comments) VALUES ('" + name + "','" + email + "'," + salary + ",'" + signdate + "','" + comments + "')";
    console.log('sql: ' + sql);
    db.connect(connectionstring, function (err, client, done) {
        client.query(sql, [], function (errqry, result) {
            done();

            if (errqry) {
                console.log('get error running query: ', errqry);
            } else {
                res.json(result.rows);
            }

        });
    });
});
// used to edit an existing player
server.put('/api/players/:id', parseJson, function (req, res) {
    var name = req.body[0].name;
    var email = req.body[0].email;
    var signdate = req.body[0].signdate;
    var salary = req.body[0].salary;
    var comments = req.body[0].comments;
    var sql = "UPDATE players SET name='" + name + "',email='" + email + "',salary=" + salary + ",signdate='" + signdate + "', comments='" + comments + "' WHERE userid=" + req.params.id;
    console.log("sql: ", sql);
    db.connect(connectionstring, function (err, client, done) {
        client.query(sql, [], function (errqry, result) {
            done();

            if (errqry) {
                console.log('get error running query: ', errqry);
            } else {
                res.json(result.rows);
            }

        });
    });
});


server.listen(port);
console.log('listening on localhost port#: ' + port); 
