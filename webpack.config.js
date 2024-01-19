// webpack.config.js

module.exports = {
    // Other configurations...
    resolve: {
      resolve: {
        fallback: { "querystring": require.resolve("querystring-es3") }
      }
    },
    module: {
      rules: [
        {
          parser: {
            amd: false
          }
        }
      ]
    }
};
