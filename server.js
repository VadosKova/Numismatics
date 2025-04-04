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

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/coins') {

        try {
          const coins = await Coin.find();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(coins));
        } catch (error) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
        }
    }
});