const path = require('path')

module.exports = {
    title: '业务组件库',
    themeConfig: {
        logo: '/assets/logo.png',
        lang: "zh-CN",
        activeHeaderLinks: false,
        displayAllHeaders: false,
        searchPlaceholder: "请输入关键词搜索",
        sidebarDepth: 2,
        nav: [{text: "GitHub", link: "https://github.com/FE-Friday/devops-components"}],
        sidebar: [
            { title: 'SVG图标', path: '/svg-icon/' },
            { title: '示例', path: '/demo/' },
        ]
    },
    plugins: [
        "fulltext-search",
        "@vuepress/back-to-top",
        "@vuepress/nprogress",
        ["vuepress-plugin-code-copy", {
            align: "top",
            staticIcon: true,
            color: "#3eaf7c"
        }],
        [
            require('./plugins/vuepress-plugin-shortlink/lib/index'),
            {
                normalSuffix: '',
                indexSuffix: '/',
                notFoundPath: '/404.html',
                containDirs: [
                    '/automation',
                    '/BFF',
                    '/issue-doc',
                    // '/components',
                    '/document',
                    '/lowCode',
                    '/performance',
                    '/scaffold',
                    '/standard',
                    '/template',
                    '/tool'
                ]
            },
        ],
        [   '@vuepress/search',
            {
                searchMaxSuggestions: 10
            }
        ],
        [
            '@vuepress/last-updated',
            {
              transformer: (timestamp, lang) => {
                const moment = require('moment')
                moment.locale(lang)
                return moment(timestamp).fromNow()
              }
            }
        ]
    ],
    markdown: {
        lineNumbers: true
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
