const db = require('../db/database');

const productsService = {
    getMasPedidos: () => {
        return db.prepare('SELECT * FROM products LIMIT 10').all();
    },

    getSugeridos: () => {
        return db.prepare('SELECT * FROM products ORDER BY RANDOM() LIMIT 4').all();
    },

    getById: (id) => {
        return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    },

    getRelated: (categoria, id) => {
        return db.prepare('SELECT * FROM products WHERE categoria = ? AND id != ? LIMIT 4').all(categoria, id);
    },

    getByCategory: (categoria) => {
        return db.prepare('SELECT * FROM products WHERE categoria = ?').all(categoria);
    },

    search: (query) => {
        const searchTerm = `%${query}%`;
        return db.prepare('SELECT * FROM products WHERE nombre LIKE ?').all(searchTerm);
    },

    getCartItems: (cartSession) => {
        if (!cartSession || cartSession.length === 0) return [];
        
        const getProductStmt = db.prepare('SELECT * FROM products WHERE id = ?');
        const items = [];
        
        for (let item of cartSession) {
            const productoReal = getProductStmt.get(item.productId || item.id);
            if (productoReal) {
                items.push({ ...productoReal, quantity: item.quantity || 1 });
            }
        }
        return items;
    }
};

module.exports = productsService;