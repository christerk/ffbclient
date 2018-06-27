const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry:'./app.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        library: 'EntryPoint'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
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
            },
        ]
    },
    devServer: {
        port:8080,
        disableHostCheck:true,
        before: function(app) {
            var api = require("./fumbblapi");
            app.get("/matches", function(req_in, res) {
                    api.get_current_matches(res);
            });
            app.get("/auth", function(req_in, res) {
                    api.authenticate(res);
            });
        }
        }
    }
