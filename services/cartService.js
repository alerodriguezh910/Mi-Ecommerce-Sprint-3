const productsService = require('./productsService');

const cartService = {

    // Inicializar carrito en sesión si no existe
    initCart: (session) => {
        if (!session.cart) {
            session.cart = [];
        }
    },


    agregarProducto: (session, productId) => {
        cartService.initCart(session);
        const itemExistente = session.cart.find(item => item.productId === productId);
        if (itemExistente) {
            itemExistente.quantity += 1;
        } else {
            session.cart.push({ productId, quantity: 1 });
        }
    },


    aumentarCantidad: (session, productId) => {
        cartService.initCart(session);
        const item = session.cart.find(item => item.productId === productId);
        if (item) {
            item.quantity += 1;
        }
    },

    
    disminuirCantidad: (session, productId) => {
        cartService.initCart(session);
        const index = session.cart.findIndex(item => item.productId === productId);
        if (index !== -1) {
            session.cart[index].quantity -= 1;
            if (session.cart[index].quantity <= 0) {
                session.cart.splice(index, 1);
            }
        }
    },

    vaciarCarrito: (session) => {
        session.cart = [];
    },

    getItems: (session) => {
        cartService.initCart(session);
        return session.cart
            .map(item => {
                const producto = productsService.getById(item.productId);
                if (!producto) return null; // Prevenir errores si el producto ya no existe en la DB
                
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    subtotal: producto.precio * item.quantity
                };
            })
            .filter(item => item !== null); // Eliminar del renderizado productos inexistentes
    },

    calcularTotal: (items) => {
        return items.reduce((acc, item) => acc + item.subtotal, 0);
    }

};

module.exports = cartService;