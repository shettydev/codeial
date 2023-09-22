const mongoose = require('mongoose');
const env = require('./environment');

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://prathikshetty1411:takeaguess@cluster0.8gmuyqp.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to the DB"));

db.once('open', function(){
    console.log('Connected to the Database :: MongoDB');
});

module.exports = db;