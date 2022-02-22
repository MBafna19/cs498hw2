const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

// Connect to a mysql database
var connection = mysql.createConnection({
        host : 'localhost',
        user : 'master',
        password : 'masterpassword',
        database : 'mydb'
});

var remote_connection = mysql.createConnection({
        host: '34.72.110.27',
        user: 'master',
        password: 'masterpassword',
        database: 'mydb'
});

connection.connect();
remote_connection.connect();

// Initialize our web app
const app = express();
app.use(bodyParser.json());

// Handle requests to the base IP/URL
app.get('/greeting', (req, res) => {
        res.send("Hello World!");
});

// Handle insert operations to our database
app.post('/register', (req, res) => {
        let n = req.body.username;
        console.log(n);
        // n = n.replace(/^[0-9\s]*|[+*\r\n]/g , '');
        console.log(n);
        query = `INSERT INTO Users (username) VALUES ('`+n+`');`;
        connection.query(query, (e,r,f)=> {
                console.log(r);
        });
        remote_connection.query(query, (e,r,f) => {
                console.log(r);
                res.json({'message' : 'Add successful.', 'users':r});
        });
});

app.get('/list', (req, res) => {
        query = `SELECT username from Users`;
        connection.query(query, (e,r,f) => {
                answer = []
                for (let i = 0; i < r.length; i++) {
                        answer[answer.length] = r[i].username;
                }
                res.json({'users': answer});
        });
});

app.post('/clear', (req, res) => {
        query = `DELETE from Users`;
        connection.query(query, (e,r,f) => {
                console.log(r);
                res.send('done');
        });
});

var http = require('http').Server(app);

const PORT = 80;
http.listen(PORT, function() {
        console.log('Listening');
});
