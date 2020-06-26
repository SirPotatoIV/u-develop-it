const express = require('express');
const inputCheck = require('./utils/inputCheck');
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
app.get('/api/candidates', (req,res) => {
    const sql = `SELECT * FROM candidates`;
    // a params argument is required, so in this case it's just empty
    const params = [];
    
    db.all(sql, params, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        
        res.json({
            message: 'Success',
            data: rows
        });
    });
});

// GET a single candidate
app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id=?`;
    const params = [req.params.id];
    
    db.get(sql, params, (err, row)=> {
        if(err){
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'Success',
            data: row
        })
    })
})

// DELETE a candidate
// Run executes the SQL query, but does not retrieve any result data
// Question mark denotes a placeholder, making this a prepared statement
// The next argument is a param, which is currently hardcoded as 1
// -- param can be an array if we need multiple values
// we are expecting to see undefined for the result argument because we are using the run method

app.delete('/api/candidates/:id', (req, res)=>{
    const sql = `DELETE FROM candidates WHERE id=?`;
    const params = [req.params.id];
    
    db.run(sql, params, function(err, result){
        if(err){
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: "Delete was succesful",
            changes: this.changes
        });
    });
});


// Create a candidate
// ES5 function, not arrow function, to use this
// we are expecting to see undefined for the result argument because we are using the run method
app.post('/api/candidates', ({ body }, res)=>{
    console.log("route for posting was hit")
    // inputCheck is a function provided by the tutorial, or as they put it the "client"
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    
    if(errors){
        res.status(400).json({error: errors});
        return;
    }
    
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.run(sql, params, function(err, result){
        if(err){
            res.status(400).json({error: err.message})
            return;
        }

        res.json({
            message: 'Creation was succesful',
            data: body,
            id: this.lastID
        })
    })

}) ;

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

