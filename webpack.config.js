const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const buildPath = path.join(__dirname, "build");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry:'./app.ts',
    output: {
        filename: '[name]-[hash].js',
        library: 'EntryPoint',
        path: buildPath
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new CleanWebpackPlugin([buildPath]),
        new HtmlWebpackPlugin({title: "ffbclient", template: "index.html"}),
        // Minify CSS
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new MiniCssExtractPlugin({
            filename: "[name]-[chunkhash].css",
            chunkFilename: "[id]-[chunkhash].css"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js', '.scss'],
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: '/node_modules/',
                loader: 'ts-loader',
            }, 
            {
                test: /\.scss$/, 
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    }, 
                    {
                        loader: "css-loader"
                    }, 
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        before: function(app) {
            var api = require("./fumbblapi");
            app.get("/matches", function(req_in, res) {
                    api.get_current_matches(res);
            });
            app.get("/auth", function(req_in, res) {
                    api.authenticate(res);
            });
        }
    },
    optimization: {
        splitChunks: {
          chunks: "all"
        }
      }
};
