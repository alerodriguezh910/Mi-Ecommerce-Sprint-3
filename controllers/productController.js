const productsService = require('../services/productsService');

const normalizeId = (idParam) => {
    const parsedId = parseInt(idParam, 10);
    if (isNaN(parsedId)) {
        return null;
    }
    return parsedId;
};

const productController = {

    login: (req, res) => {
        res.render('pages/login');
    },

    register: (req, res) => {
        res.render('pages/register');
    },

    procesarRegister: (req, res) => {
        res.redirect('pages/index');
    },

    checkout: (req, res) => {
        res.render('pages/checkout');
    },

    carrito: (req, res) => {
        const cartSession = req.session?.cart || [];

        const cartItems = productsService.getCartItems(cartSession);

        res.render('pages/carrito', { cartItems: cartItems });
    },

    index: (req, res) => {

        try {
            const sugeridos = productsService.getSugeridos();
            const top10 = productsService.getMasPedidos();

            res.render('pages/index', {
                topProducts: top10,
                sugeridos: sugeridos
            });

        } catch (error) {
            console.error("Error cargando los productos en la Home:", error);
            res.render('pages/index', {
                topProducts: [],
                sugeridos: []
            });
        }
    },

    descripcion: (req, res) => {

        const productId = normalizeId(req.params.id);

        if (productId === null) {
            return res.status(400).send('Error 400: Solicitud incorrecta. El ID del producto debe ser un número.');
        }

        const productoPrincipal = productsService.getById(productId);

        if (!productoPrincipal) {
            return res.status(404).send('Error 404: No se encontro el producto');
        }

        const relacion = productsService.getRelated(productoPrincipal.categoria, productId);

        res.render('pages/descripcion', {
            producto: productoPrincipal,
            relacion: relacion
        });

    },
    
    categoria: (req, res) => {
        const categoryParam = req.params.category;
        const productosFiltrados = productsService.getByCategory(categoryParam);

        res.render('pages/categorias', {
            categoriaNombre: categoryParam,
            productos: productosFiltrados
        });
    },

    search: (req, res) => {
        try {
            const query = req.query.query?.toLowerCase() || '';
            const resultados = productsService.search(query);

            res.render('pages/searchResults', {
                resultados,
                query
            });

        } catch (error) {
            console.error("Error en la búsqueda:", error);
            res.render('pages/searchResults', {
                resultados: [],
                query: ''
            });
        }
    }
};
module.exports = productController;