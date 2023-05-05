const path = require('path')

module.exports = {
    title: '业务组件库',
    description: 'make things easier',
    themeConfig: {
        logo: '/assets/logo.png',
        sidebar: 'auto'
    },
    chainWebpack: (config) => {
        config.module
            .rule('devops-svg')
            .test(/\.svg$/)
            .include.add(path.resolve('docs'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')

        config.module.rule('svg').exclude.add(path.resolve('docs')).end()
    }
  }
