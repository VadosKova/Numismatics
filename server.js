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

    else if (req.method === 'POST' && req.url === '/coins') {

        let body = '';
        
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { name, material, country, year, price } = JSON.parse(body);
                const newCoin = new Coin({ name, material, country, year, price });
                await newCoin.save();
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Coin added', coin: newCoin }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error' }));
            }
        });
    }

    else if (req.method === 'DELETE' && req.url.startsWith('/coins/')) {

        const coinId = req.url.split('/')[2];
        try {
            const deletedCoin = await Coin.findByIdAndDelete(coinId);
            if (deletedCoin) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Coin deleted', coin: deletedCoin }));
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Coin not found' }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error' }));
        }
    }


});


const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});