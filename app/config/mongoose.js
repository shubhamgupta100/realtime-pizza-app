
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/pizza',{useNewUrlParser: true});
mongoose.connect('mongodb+srv://shubham:sv4xbnZqn0yXkqCp@cluster0.l5wna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on('error',console.error.bind(console,"Error on connecting databse"));
db.once('open',function(){
    console.log("We are connected");
});
module.exports = db;