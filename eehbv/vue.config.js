module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:5000'
      },
      '/static/*': {
        target: 'http://localhost:5000'
      }
    }
  }
}
