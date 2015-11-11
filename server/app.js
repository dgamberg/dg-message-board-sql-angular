var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/message-board';
//var connectionString = process.env.DATABASE_URL + "?ssl=true" || 'postgres://localhost:5432/message-board';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

// Get all the messages information
app.get('/data', function(req,res){
    var results = [];

    //SQL Query > SELECT data from table
    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT * FROM messages ORDER BY id DESC;");


        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});




// Add a new person
app.post('/data', function(req,res){
    // pull the data off of the request
    var addedMessage = {
        "name" : req.body.enterFirstName,
        "message" : req.body.enterMessage

    };

    pg.connect(connectionString, function (err, client) {
        client.query("INSERT INTO messages (name, message) VALUES ($1, $2) RETURNING id",
            [addedMessage.name, addedMessage.message],
        function(err, result) {
            if(err) {
                console.log("Error inserting data: ", err);
                res.send(false);
            }

            res.send(true);
        });
    });
});

app.delete('/data', function(req,res){
    var messageID = req.body.id;
    console.log(req);

    pg.connect(connectionString, function (err, client) {
        //SQL Query > Insert Data
        //Uses prepared statements, the $1 and $2 are placeholder variables. PSQL then makes sure they are relatively safe values
        //and then uses them when it executes the query.
        client.query("DELETE FROM messages WHERE id = $1", [messageID],
            function(err, result) {
                if(err) {
                    console.log("Error deleting row: ", err);
                    //res.send(false);
                }
                res.send(true);
            });

    });


});

app.get("/find", function(req, res) {
    var results = [];
    var personName = "%" + req.query.messagesSearch + "%";

    //SQL Query > SELECT data from table
    pg.connect(connectionString, function (err, client, done) {

        var query = client.query("SELECT * FROM messages WHERE name ILIKE $1", [personName]);

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

app.get("/admin", function(req,res){
    var file = req.params[0] || "/views/admin.html";
    res.sendFile(path.join(__dirname, "./public", file));
});

app.get("/*", function(req,res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "./public", file));
});

app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});
