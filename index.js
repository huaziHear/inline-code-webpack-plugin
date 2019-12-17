const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * 把打包编译好的脚本插入到html的固定位置
    {
        // 插入打包后的代码
        headTags: ['inlinejs', 'skeleton'], 
        whateverTags: ['skeleton'],
        // 直接插入标签
        contentTags: {
            tagName: 'script',
            innerHTML: 'var a= 1;',
            attributes: {
                href: '',
                src: ''
            }
        }
    }
 */
module.exports = class InlineCodeWebpackPlugin {
    constructor(option = {}) {
        this.headTags = option.headTags || [];
        this.bodyTags = option.bodyTags || [];
    } 
    constructorHTMLTag (compilation) {
        const entryNames = Object.keys(compilation.assets);
        const hash = compilation.hash.substr(0,6);
        const config2tag = (config) => {
            if (typeof config === 'string') {
                let key = config + '.js'
                if (process.env.NODE_ENV === 'production') {
                    key = `${config}-${hash}`;
                }
                const assetName = entryNames.filter((t) => t.includes(key))[0];
                return {
                    tagName: assetName.match(/.js$/) ? 'script':'style',
                    innerHTML: compilation.assets[assetName].source()
                }
            } else if (typeof config === 'object') {
                return config;
            }
        }

        this.headTags = this.headTags.map(config2tag);
        this.bodyTags = this.bodyTags.map(config2tag);
    }
    apply (compiler) {
        // HtmlWebpackPlugin version >= 4.0.0-beta.5
        if (HtmlWebpackPlugin.getHooks) {
            compiler.hooks.compilation.tap('HtmlWebpackInjectorPlugin', (compilation) => {
                HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
                    'InlineCodeWebpackPlugin', (data, callback) => {
                        this.constructorHTMLTag(compilation);
                        data.headTags = this.headTags.concat(data.headTags);
                        data.bodyTags = this.bodyTags.concat(data.bodyTags);
                        callback(null, data)
                    }
                )
            });
        } else {
            throw 'Please use the latest version of HtmlWebpackPlugin'
        }
    }
}