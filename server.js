const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not FOund) Catch all
// -- needs to come after the routes
app.use((req,res)=>{
    res.status(404).end();
})

// Start server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});

