/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const { pagination } = require('../utils/utils');
const { getAllData } = require('../bk_data/functiones');

module.exports = {
  getData: (req, resp, next, table) => {
    const { page, limit } = req.query;
    const pages = Number(page);
    const limits = Number(limit);
    getAllData(table)
      .then((result) => {
        const response = pagination(pages, limits, result, table);
        console.log(response.list);
        resp.header('link', response.link);
        if (response.list) {
          const jsonUserResp = response.list.map((x) => {
            const role = (x.rolesAdmin) || false;
            const id = (!x._id) ? 0 : (x._id).toString();
            return {
              _id: id,
              email: x.email,
              roles: { admin: role },
            };
          });
          const jsonProductsResp = response.list.map((element) => {
            element._id = (!element._id) ? 0 : (element._id).toString();
            return element;
          });
          // eslint-disable-next-line array-callback-return
          // eslint-disable-next-line no-console
          switch (table) {
            case 'users':
              return resp.status(200).send(jsonUserResp);
            case 'products':
              return resp.status(200).send(jsonProductsResp);
            default:
              break;
          }
        }
        return resp.status(404).send('Page not found');
      });
  },
};
