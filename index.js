require('dotenv').config();
const express = require('express');
const app = express();


// Setting up MongoDB database connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true } )
const database = mongoose.connection;
database.on('error', (error) => console.error(error));
database.once('open', () => console.log('Connected to database'));



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('views'));

const serverRouter =  require('./routes/users')
app.use('/users', serverRouter);

app.get('/', (req, res) => {
    res.render('index.html')
});

app.post('/', (req, res) => {
    let newUser = {
        username: req.body.username,
        password: req.body.password
    }
    res.send(newUser.username + newUser.password);

    //send to server

    //check login in database

    //
    res.redirect('server.html');
});

app.listen(process.env.PORT || 8081, () => { console.log(`Server currently online`); });