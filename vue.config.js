module.exports = {
  pluginOptions: {
    autoRouting: {
      chunkNamePrefix: 'page-'
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  devServer: {   
    proxy: {        
      '/api': {    
        target: 'http://yapi.demo.qunar.com/mock/96920',  // 接口域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/api': ''   
        }              
      }
    }
  }
}
