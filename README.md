# inline-code-webpack-plugin
webpack插件，支持将打包结果或者自定义js、css内联插入到html中。

```
entry: {
		bundle: [''],
		inlinejs: [''],
		skeleton: ['']
},
plugins: [
    new htmlWebpackPlugin({
        template: './index.html',
        chunks: ['bundle'],
        inject: false,
        minify: false
    }),
    new InlineCodeWebpackPlugin({
        // 插入打包后的代码
        headTags: ['skeleton'], 
        bodyTags: ['inlinejs', {
            tagName: 'script',
            innerHTML: 'var a= 1;', // 注入自定义脚本
            attributes: {
                href: '',
                src: ''
            }
        }]
    }),
]

```
