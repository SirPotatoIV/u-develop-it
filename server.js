const express = require('express');
const PORT = process.env.PORT || 3001;
// database
// verbose turns on messages in the terminal regarding the state of the runtime
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Connect to the database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
})

// Gets all the rows from the database.
// -- response is called rows because each row is returned as an object
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//     if(err){
//         console.log(err);
//     }
//     console.log(rows);
// });

// GET a single candidate
// db.get(`SELECT * FROM candidates WHERE id=15`, (err, row)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(row);
// })

// DELETE a candidate
// Run executes the SQL query, but does not retrieve any result data
// Question mark denotes a placeholder, making this a prepared statement
// The next argument is a param, which is currently hardcoded as 1
// -- param can be an array if we need multiple values
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result){
//     if(err){
//         console.log(err);
//     }
//     console.log(result, this, this.changes);
// })

// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
                VALUES(?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];
//ES5 function, not arrow function, to use this
db.run(sql, params, function(err, result) {
    if (err) {
        console.log(err);
    }
    console.log(result, this.lastID);
});

// Default response for any other request (Not FOund) Catch all
// -- needs to come after the routes
app.use((req,res)=>{
    res.status(404).end();
})

// Start server
// -- wrapped function ensures that server starts after conenction to database
db.on('open', ()=> {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}!`);
    });
})

