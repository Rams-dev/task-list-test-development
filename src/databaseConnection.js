const mysql = require('mysql');

//mysql no soporta promesas por eso se ocupa promisify
const {promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            console.error('LA CONECCION DE LA BASE DE DATOS FUE CERRADA');
        }
        if(err.code == 'ER_CON_COUNT_ERROR'){
            console.error('LA BASE DE DATOS TIENE ALGUNAS CONECCIONES');
        }
        if(err.code == 'ECONNREFUSED') {
            console.error("CONEXION RECHAZADA");
        }
    }
    if(connection) connection.release();
    console.log('la base de datos esta conectada');
    return
});
//convierte los callback a promesas
pool.query = promisify(pool.query)

module.exports = pool;