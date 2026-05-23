
const express = require('express');
const session = require('express-session');
const app = express();
const productRoutes = require('./routes/productRoute');
const cartRoutes = require('./routes/cartRoute');
require('./database');


app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));


app.use(session({
    secret: 'mi-ecommerce-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    let total = 0;
    
    if (req.session.cart && Array.isArray(req.session.cart)) {
        total = req.session.cart.reduce((acum, item) => {
            let cantidad = parseInt(item.quantity) || 0; 
            return acum + cantidad;
        }, 0);
    }
    res.locals.totalCarrito = total;
    next();
});

app.use(express.static('public'));


app.use('/', productRoutes);
app.use('/cart', cartRoutes);


app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(3000, () => console.log("Server en linea 🫡"));