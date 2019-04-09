const path = require('path');
const webpack = require('webpack');
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
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js'],
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
