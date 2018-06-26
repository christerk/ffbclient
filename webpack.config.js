const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry:'./app.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
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
            app.get("/auth", function(req_in, res) {
                var fs = require('fs');
                var https = require('https');
                var querystring = require('querystring');
                fs.readFile('auth.json', function(err, data) {
                    if (err) throw err;
                    var json_data = JSON.parse(data);

                    var form = {
                        grant_type: "client_credentials",
                        client_id: json_data.client_id, 
                        client_secret: json_data.secret, 
                    };
                    var formData = querystring.stringify(form);
                    var contentLength = formData.length;

                    var options = {
                        host:"fumbbl.com",
                        path:"/api/oauth/token",
                        method:"POST",
                        headers:{"Content-Type":"application/x-www-form-urlencoded" }
                    };

                    callback = function(response) {
                        var str = "";
                        var bearer;
                        response.on('data', function (data) {
                            str += data;
                        });

                        response.on('end', function () {
                            bearer = JSON.parse(str);
                            res.json(bearer);
                        });
                    }

                    var req = https.request(options, callback);
                    req.write(querystring.stringify(form));
                    req.end();
                });
            });
        }
        }
    }
