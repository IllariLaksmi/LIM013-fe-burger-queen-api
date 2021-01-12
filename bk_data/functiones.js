/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const conexion = require('./data.js');

const getAllData = (table) => new Promise((resolve, reject) => {
  const sql = `SELECT * FROM users WHERE email = "${email}" `;
  conexion.query(sql, (error, result) => {
    if (result.length) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const getDataByKeyword = (table, keyword, value) => new Promise((resolve, reject) => {
  conexion.query(`SELECT * FROM ${table} WHERE ${keyword}=?`, value, (error, result) => {
    if (result.length > 0) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

const createData = (table, toInsert) => new Promise((resolve, reject) => {
  conexion.query(`INSERT INTO ${table} SET ?`, toInsert, (error, result) => {
    resolve(result);
    reject(error);
  });
});

const updateDataByKeyword = (table, toUpdate, keyword, value) => new Promise((resolve, reject) => {
  conexion.query(`UPDATE ${table} SET ? WHERE ${keyword} = ?`, [toUpdate, value], (error, result) => {
    // eslint-disable-next-line no-param-reassign
    resolve(result);
    reject(error);
  });
});

const deleteData = (table, id, idValue) => new Promise((resolve, reject) => {
  conexion.query(`DELETE FROM ${table} WHERE ${id} = ?`, idValue, (error, result) => {
    resolve(result);
    reject(error);
  });
});

module.exports = {
  getAllData,
  getDataByKeyword,
  createData,
  updateDataByKeyword,
  deleteData,
};
