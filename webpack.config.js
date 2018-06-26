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
            var https = require('https');
            var fs = require('fs');
            var querystring = require('querystring');
            var host = "fumbbl.com";
            var client_id = "";

            app.get("/matches", function(req_in, res) {
                    var matches_options = {
                        host: host,
                        path:"/api/match/current",
                        method:"GET"
                    };
                
                matches_callback = function(response) {
                    var str = "";
                    response.on('data', function (data) {
                        str += data;
                    });

                    response.on('end', function () {
                        res.json(JSON.parse(str));
                    });
                };

                var matches_req = https.request(matches_options, matches_callback);
                matches_req.end();

            });
            app.get("/auth", function(req_in, res) {
                fs.readFile('auth.json', function(err, data) {
                    if (err) throw err;
                    var json_data = JSON.parse(data);
                    client_id = json_data.client_id;

                    var form = {
                        grant_type: "client_credentials",
                        client_id: client_id,
                        client_secret: json_data.secret, 
                    };
                    var formData = querystring.stringify(form);
                    var contentLength = formData.length;

                    var bearer_options = {
                        host: host,
                        path:"/api/oauth/token",
                        method:"POST",
                        headers:{"Content-Type":"application/x-www-form-urlencoded" }
                    };

                    auth_callback = function(response) {
                        var str = "";
                        response.on('data', function (data) {
                            str += data;
                        });

                        response.on('end', function () {
                            res.json({client_id: client_id, token:JSON.parse(str)});
                        });
                    };

                    bearer_callback = function(response) {
                        var str = "";
                        response.on('data', function (data) {
                            str += data;
                        });

                        response.on('end', function () {
                            var bearer = JSON.parse(str);
                            var auth_token_options = {
                                host: host,
                                path:"/api/auth/getToken",
                                method:"POST",
                                headers:{
                                    accept: "application/json",
                                    Authorization: " Bearer " + bearer.access_token
                                }

                            };

                            var auth_req = https.request(auth_token_options, auth_callback);
                            auth_req.end();
                        });
                    }

                    var bearer_req = https.request(bearer_options, bearer_callback);
                    bearer_req.write(querystring.stringify(form));
                    bearer_req.end();
                });
            });
        }
        }
    }
