const mysql = require('mysql');
const config = require('../config');

const { dbUrl } = config;
const conexion = mysql.createConnection(dbUrl);
// eslint-disable-next-line no-console
module.exports = conexion;
