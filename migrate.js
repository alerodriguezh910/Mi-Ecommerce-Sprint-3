const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'db', 'ecommerce.db');
const db = new Database(dbPath);


const schemaPath = path.join(__dirname, 'db', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);
console.log('📋 Tablas verificadas/creadas correctamente');


const jsonPath = path.join(__dirname, 'data', 'productos.json');
const productos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const insert = db.prepare(`
    INSERT OR IGNORE INTO products (id, nombre, precio, imagen, destacado, categoria, stock)
    VALUES (@id, @nombre, @precio, @imagen, @destacado, @categoria, @stock)
`);


const migrar = db.transaction((productos) => {
    for (const producto of productos) {
        insert.run({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen || '',
            destacado: producto.destacado ? 1 : 0,
            categoria: producto.categoria || '',
            stock: producto.stock || 0
        });
    }
});


try {
    migrar(productos);
    console.log(`✅ ${productos.length} productos migrados correctamente a SQLite`);
} catch (error) {
    console.error('❌ Error durante la migración:', error);
}


const total = db.prepare('SELECT COUNT(*) as total FROM products').get();
console.log(`📦 Total de productos en la base de datos: ${total.total}`);

db.close();