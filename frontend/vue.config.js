module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://api.yourserver.com',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      },
    },
  };