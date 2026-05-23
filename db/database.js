const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'ecommerce.db');


const db = new Database(dbPath, { 
    verbose: console.log 
});


const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

try {
    db.exec(schema);
    console.log("Base de datos SQLite inicializada correctamente 🚀");
} catch (error) {
    console.error("Error al crear las tablas en la base de datos:", error);
}

module.exports = db;