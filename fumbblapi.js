var https = require('https');
var fs = require('fs');
var querystring = require('querystring');
var host = "fumbbl.com";


module.exports = {
    get_current_matches: function(res){

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
    },

    authenticate: function(res){
        fs.readFile('auth.json', function(err, data) {
            if (err) throw err;
            var json_data = JSON.parse(data);
            var user_id = json_data.user_id;

            var form = {
                grant_type: "client_credentials",
                client_id: json_data.client_id,
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
                    res.json({user_id: user_id, token:JSON.parse(str)});
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
    }
}
