/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/uhu/admin/api/': {
      //target: 'http://192.168.10.175:8093',
      target: 'http://tapi.fungoweb.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },

  test: {
    '/uhu/admin/api/': {
      target: 'http://192.168.10.175:8093',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/uhu/admin/api/': {
      target: 'http://gapi.fungoweb.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
