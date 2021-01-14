/* eslint-disable no-param-reassign */
const { pagination } = require('../utils/utils');
const { getAllData, getDataByKeyword } = require('../bk_data/functiones');

module.exports = {
  getData: (req, resp, next, table) => {
    const { page, limit } = req.query;
    const pages = Number(page);
    const limits = Number(limit);
    return getAllData(table).then((result) => {
      const response = pagination(pages, limits, result, table);
      resp.header('link', response.link);
      if (response.list) {
        const getUsers = (list) => {
          const respJsonUser = list.map((element) => {
            const role = element.rolesAdmin || false;
            const id = !element._id ? 0 : element._id.toString();
            return {
              _id: id,
              email: element.email,
              roles: { admin: role },
            };
          });
          return respJsonUser;
        };
        const getProducts = (list) => {
          const respJsonProduct = list.map((element) => {
            // eslint-disable-next-line no-param-reassign
            element._id = !element._id ? 0 : element._id.toString();
            return element;
          });
          return respJsonProduct;
        };
        const getOrders = (list) => {
          const respJsonOrder = list.map((order) => getDataByKeyword('orders_products', 'orderId', order._id).then(
            (array) => {
              const arrayOrder = array.map((element) => getDataByKeyword('products', '_id', element.productId).then(
                (product) => ({
                  qty: element.qty,
                  product: product[0],
                }),
              ));
              console.info(arrayOrder);
              return Promise.all(arrayOrder).then((producto) => {
                order.products = producto;
                return order;
                // return resp.status(200).send(order);
              });
            },
          ));
          return respJsonOrder;
        };
        switch (table) {
          case 'users':
            return resp.status(200).send(getUsers(response.list));
          case 'products':
            return resp.status(200).send(getProducts(response.list));
          case 'orders':
            return Promise.all(getOrders(response.list)).then((result) => {
              resp.status(200).send(result);
            });
          default:
            break;
        }
      }
      return resp.status(404).send('Page not found');
    });
  },
};
