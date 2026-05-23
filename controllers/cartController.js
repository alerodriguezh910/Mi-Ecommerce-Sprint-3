const cartService = require('../services/cartService');
const productsService = require('../services/productsService');

const normalizeId = (idParam, res) => {
    const parsedId = parseInt(idParam, 10);
    if (isNaN(parsedId)) {
        res.status(400).send('Error 400: El ID del producto debe ser un número.');
        return null;
    }

    const product = productsService.getById(parsedId);
    if (!product) {
        res.status(404).send('Error 404: Producto no encontrado.');
        return null;
    }

    return product;
};

const verCarrito = (req, res) => {
    const items = cartService.getItems(req.session);
    const total = cartService.calcularTotal(items);
    res.render('pages/carrito', { items, total });
};

const agregarProducto = (req, res) => {
    const product = normalizeId(req.params.id, res);
    if (!product) return;

    if (product.stock > 0) {
        cartService.agregarProducto(req.session, product.id);
    } else {
        console.log("Alerta de seguridad: Intento de agregar producto sin stock.");
    }

    res.redirect('/cart');
};

const aumentarCantidad = (req, res) => {
    const product = normalizeId(req.params.id, res);
    if (!product) return;

    cartService.aumentarCantidad(req.session, product.id);
    res.redirect('/cart');
};

const disminuirCantidad = (req, res) => {
    const product = normalizeId(req.params.id, res);
    if (!product) return;

    cartService.disminuirCantidad(req.session, product.id);
    res.redirect('/cart');
};

const vaciarCarrito = (req, res) => {
    cartService.vaciarCarrito(req.session);
    res.redirect('/cart');
};

module.exports = {
    verCarrito,
    agregarProducto,
    aumentarCantidad,
    disminuirCantidad,
    vaciarCarrito
};