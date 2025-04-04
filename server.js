const http = require('http');
const mongoose = require('mongoose');
 
mongoose.connect('mongodb+srv://admin:admin@db.bdboune.mongodb.net/?retryWrites=true&w=majority&appName=DB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection error:", err));


const coinSchema = new mongoose.Schema({
    name: String,
    material: String,
    country: String,
    year: Number,
    price: Number
});
 
const Coin = mongoose.model('Coin', coinSchema);