const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport')
const path = require('path')

const users = require('./routes/api/users')


const app = express();
// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


//passport middleware
app.use(passport.initialize())

//pass config
require('./config/passport')(passport)

//routes
app.use('/api/users', users)

//serve static assests if in production
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/public'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
    });
}


const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server running on port ${port} !`));