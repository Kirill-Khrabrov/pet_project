const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: process.env.NODE_ENV,
    entry: ['@babel/polyfill', './src/main.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'js/build.[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(gif|jpg|png|svg|eot|woff|woff2|pdf|txt)$/,
                loader: 'file-loader',
                options: {
                    context: path.resolve(__dirname, './src'),
                    name: '[path][name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.js', '.vue']
    },
    plugins: [     
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),        
        new VueLoaderPlugin()
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: ['default', {
                        discardComments: {
                            removeAll: true
                        }
                    }]
                }
            })
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        watchContentBase: true,
        watchOptions: {
            poll: true
        },
        hot: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        port: process.env.PORT || 8080,
        publicPath: '/',
        compress: true,
        https: false,
        overlay: false,
        historyApiFallback: {
            disableDotRule: true
        }
    },
    performance: {
        hints: false
    }
}
