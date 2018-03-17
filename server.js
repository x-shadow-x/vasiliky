var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var util = require('util');
var app = http.createServer();


function parseParams(string) {
    var arr = string.split('&');
    var result = {};
    arr.forEach(function(item) {
        var tmpArr = item.split('=');
        result[tmpArr[0]] = tmpArr[1];
    });
    return result;
}

function handleCommentList(req, res) {
    function readData(type, cb) {
        fs.readFile(path.resolve(__dirname, 'data\\' + type + '.json'), function(err, data) {
            if (err) {
                handleError(err, result);
            } else {
                cb(JSON.parse(data));
            }
        });
    }

    function writeData(type, data, cb) {
        fs.writeFile(path.resolve(__dirname, 'data\\' + type + '.json'), JSON.stringify(data), function(err) {
            if (err) {
                handleError(err, result);
            } else {
                cb();
            }
        });
    }

    function finish(obj) {
        res.end(JSON.stringify(obj));
    }

    function handleError(err, result) {
        result.code = -1;
        result.errMsg = err.message;
        finish(result);
    }
    var parsed = url.parse(req.url);
    var params = parseParams((parsed.search || '').substr(1));
    var result = {
        code: 0,
        errMsg: undefined
    };
    var formData = '';
    switch (req.method.toUpperCase()) {
        case 'DELETE':
            {
                req.on('data', function(chunk) {
                    if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                        formData = formData + chunk.toString();
                    }
                });
                req.on('end', function() {
                    var params = parseParams(formData);
                    if (params.id) {
                        readData('comment', function(data) {
                            var flag = false;
                            var target;
                            data.forEach(function(item, index) {
                                if (item.id == params.id) {
                                    flag = true;
                                    target = index;
                                }
                            });
                            if (flag) {
                                data.splice(target, 1);
                                writeData('comment', data, function() {
                                    finish(result);
                                });
                            } else {
                                handleError({
                                    message: 'can not find id ' + params.id
                                }, result);
                            }
                        });
                    } else {
                        handleError({
                            message: 'no id provided'
                        }, result);
                    }
                });
                break;
            }
        case 'POST':
            {
                req.on('data', function(chunk) {
                    if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                        formData = formData + chunk.toString();
                    }
                });
                req.on('end', function() {
                    var params = eval("(" + formData + ")");
                    if (!params.songId) {
                        handleError({
                            message: 'no songId id provided'
                        }, result);
                    } else {
                        readData('comment', function(data) {
                            var flag = false;
                            for (var i = 0, len = data.length; i < len; i++) {
                                if (data[i].songId == params.songId) {
                                    flag = true;
                                    break;
                                }
                            }

                            if (!flag) {
                                data.push({
                                    songId: params.songId,
                                    data: [params.content]
                                });
                            } else {
                                data[i].data.push(params.content);
                            }

                            writeData('comment', data, function() {
                                finish(result);
                            });
                        });
                    }
                });
                break;
            }
        case 'PUT':
            {
                req.on('data', function(chunk) {
                    if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                        formData = formData + chunk.toString();
                    }
                });
                req.on('end', function() {
                    var params = parseParams(formData);
                    params.id = +params.id;
                    if (params.id) {
                        readData('comment', function(data) {
                            var flag = false;
                            var target;
                            data.forEach(function(item, index) {
                                if (item.id == params.id) {
                                    flag = true;
                                    target = index;
                                }
                            });
                            if (flag) {
                                data[target] = params;
                                writeData('comment', data, function() {
                                    finish(result);
                                });
                            } else {
                                handleError({
                                    message: 'can not find id ' + params.id
                                }, result);
                            }
                        });
                    } else {
                        handleError({
                            message: 'no id provided'
                        }, result);
                    }
                });
                break;
            }
        case 'GET':
        default:
            {
                var data = {
                    list: [],
                    total: 0,
                    pageSize: +params.pl || 10,
                    pageNum: +params.pn || 1
                };

                params.songId = +params.songId;
                if (params.songId !== '') {
                    fs.readFile(path.resolve(__dirname, 'data\\comment.json'), function(err, d) {
                        if (err) {
                            if (err.code === 'ENOENT') {
                                fs.writeFile(path.resolve(__dirname, 'data\\comment.json'), '[]', function(err) {
                                    if (err) {
                                        handleError(err, result);
                                        return;
                                    }
                                    result.data = data;
                                    finish(result);
                                });
                            } else {
                                handleError(err, result);
                            }
                        } else {
                            var parsedData = JSON.parse(d);

                            parsedData = parsedData.filter(function(item) {
                                return item.songId == params.songId;
                            });
                            if (parsedData.length == 0) {
                                data.data = [];
                                data.total = 0;
                            } else {
                                data.data = parsedData[0].data.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                                data.total = parsedData[0].data.length;
                            }
                            result.data = data;
                            finish(result);
                        }
                    });
                } else {
                    handleError({
                        message: 'no songId provided'
                    }, result);
                }
            }
    }
}

app.on('request', function(req, res) {
    var requestUrl = url.parse(req.url).pathname;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    switch (requestUrl) {

        case '/get-data':
            {
                handleIssueList(req, res);
                break;
            }
        case '/get-comment':
            {
                handleCommentList(req, res);
                break;
            }
        default:
            {
                // res.end(JSON.stringify({data: 'ok'}));
                var filePath = '.' + requestUrl;
                if (filePath == './')
                    filePath = './index.html';

                var extname = path.extname(filePath);
                var contentType = 'text/html';
                var ifbinary = false;
                switch (extname) {
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.gif':
                        contentType = 'image/gif';
                        ifbinary = true;
                        break;
                    case '.png':
                        contentType = 'image/png';
                        ifbinary = true;
                        break;
                    case '.jpg':
                        contentType = 'image/jpeg';
                        ifbinary = true;
                        break;
                }
                // console.log(path);
                fs.exists(filePath, function(exists) {

                    if (exists) {
                        if (ifbinary) {
                            fs.stat(filePath, function(error, stat) {
                                var rs;
                                res.writeHead(200, {
                                    'Content-Type': contentType,
                                    'Content-Length': stat.size
                                });
                                rs = fs.createReadStream(filePath);
                                util.pump(rs, res, function(err) {
                                    if (err) {
                                        throw err;
                                    }
                                });
                            });
                        } else {
                            fs.readFile(filePath, function(error, content) {
                                if (error) {
                                    res.writeHead(500);
                                    res.end();
                                } else {
                                    res.writeHead(200, {
                                        'Content-Type': contentType
                                    });
                                    res.end(content, 'utf-8');
                                }
                            });
                        }
                    } else {
                        res.writeHead(404);
                        res.end();
                    }
                });
            }
    }
});

app.listen(18080);
console.log('server is start at 18080');