// load libraries and required modules
const express = require('express');
const handlebars = require('express-handlebars');

// configure the port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

// create the instance of the express server
const app = express();

// configure the view engine to work with handlebars
app.engine('hbs', handlebars({ defaultLayout: 'default.hbs' }));
app.set('view engine', 'hbs');

let inventory = [];

// implement the middleware for the various routes
app.get('/', (req, res, next) => {
    res.status(200).type('text/html');
    res.render('index', { hasInventory: !!inventory.length, inventory: inventory, inventoryState: JSON.stringify(inventory) });
    inventory = [];
});

app.post('/', express.urlencoded({ extended: true }), express.json(), (req, res, next) => {
    console.info('Body: ', req.body);

    inventory = JSON.parse(req.body['inventoryState']);
    const data = {
        item: req.body['item'],
        quantity: req.body['quantity'],
        unitPrice: parseFloat(req.body['unitPrice']).toFixed(2)
    };
    inventory.push(data);

    res.redirect('/');
});

app.use(express.static(__dirname + '/public'));

// start the server
app.listen(PORT, () => {
    console.info(`Server was started on port ${PORT} at ${new Date()}`);
});