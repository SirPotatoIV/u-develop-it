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

db.all(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
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

