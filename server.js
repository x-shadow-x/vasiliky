var http = require('http');
var path = require('path');
var app = http.createServer();
var fs = require('fs');
var url = require('url');


function parseParams (string) {
    var arr = string.split('&');
    var result = {};
    arr.forEach(function (item) {
        var tmpArr = item.split('=');
        result[tmpArr[0]] = tmpArr[1];
    });
    return result;
}


function handleIssueList (req, res) {
    function readData(type, cb) {
        fs.readFile(path.resolve(__dirname, type + '.json'), function (err,data) {
            if (err) {
                handleError(err, result);
            } else {
                cb(JSON.parse(data));
            }
        });
    }
    function writeData(type, data, cb) {
        fs.writeFile(path.resolve(__dirname, type +'.json'), JSON.stringify(data), function (err) {
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
    function handleError (err, result) {
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
        case 'DELETE': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                if (params.id) {
                    readData('issue', function (data) {
                        var flag = false;
                        var target;
                        data.forEach(function (item, index) {
                            if (item.id == params.id) {
                                flag = true;
                                target = index;
                            }
                        });
                        if (flag) {
                            data.splice(target, 1);
                            writeData('issue', data, function () {
                                finish(result);
                            });
                        } else {
                            handleError({message: 'can not find id '+ params.id}, result);
                        }
                    });
                } else {
                    handleError({message: 'no id provided'}, result);
                }
            });
            break;
        }
        case 'POST': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                readData('issue', function (data) {
                    var length = data.length;
                    params.id = data[length - 1] ? data[length - 1].id + 1 : 1;
                    data.push(params);
                    writeData('issue', data, function () {
                        finish(result);
                    });
                });
            });
            break;
        }
        case 'PUT': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                params.id = +params.id;
                if (params.id) {
                    readData('issue', function (data) {
                        var flag = false;
                        var target;
                        data.forEach(function (item, index) {
                            if (item.id == params.id) {
                                flag = true;
                                target = index;
                            }
                        });
                        if (flag) {
                            data[target] = params;
                            writeData('issue', data, function () {
                                finish(result);
                            });
                        } else {
                            handleError({message: 'can not find id '+ params.id}, result);
                        }
                    });
                } else {
                    handleError({message: 'no id provided'}, result);
                }
            });
            break;
        }
        case 'GET':
        default: {
            var data = {
                list: [],
                total: 0, 
                pageSize: +params.pageSize || 10, 
                pageNum: +params.pageNum || 1
            };
            fs.readFile(path.resolve(__dirname, 'issue.json'), function (err, d) {
                if (err) {
                    if (err.code === 'ENOENT') {
                        fs.writeFile(path.resolve(__dirname, 'issue.json'), '[]', function (err) {
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
                    data.data = parsedData.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                    data.total = parsedData.length;
                    result.data = data;
                    finish(result);
                }
            });
        }
    }
}

function handleCommentList (req, res) {
    function readData(type, cb) {
        fs.readFile(path.resolve(__dirname, type + '.json'), function (err,data) {
            if (err) {
                handleError(err, result);
            } else {
                cb(JSON.parse(data));
            }
        });
    }
    function writeData(type, data, cb) {
        fs.writeFile(path.resolve(__dirname, type +'.json'), JSON.stringify(data), function (err) {
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
    function handleError (err, result) {
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
        case 'DELETE': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                if (params.id) {
                    readData('comment', function (data) {
                        var flag = false;
                        var target;
                        data.forEach(function (item, index) {
                            if (item.id == params.id) {
                                flag = true;
                                target = index;
                            }
                        });
                        if (flag) {
                            data.splice(target, 1);
                            writeData('comment', data, function () {
                                finish(result);
                            });
                        } else {
                            handleError({message: 'can not find id '+ params.id}, result);
                        }
                    });
                } else {
                    handleError({message: 'no id provided'}, result);
                }
            });
            break;
        }
        case 'POST': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                params.issueId = +params.issueId;
                if (!params.issueId) {
                    handleError({message: 'no issue id provided'}, result);
                } else {
                    readData('issue', function (data) {
                        var flag = false;
                        data.forEach(function (item) {
                            if (item.id == params.issueId) {
                                flag = true;
                            }
                        });
                        if (!flag) {
                            handleError({message: 'can not find issue by id '+ params.issueId}, result);
                            return;
                        }
                        readData('comment', function (data) {
                            var length = data.length;
                            params.id = data[length - 1] ? data[length - 1].id + 1 : 1;
                            data.push(params);
                            writeData('comment', data, function () {
                                finish(result);
                            });
                        });
                    });
                }
            });
            break;
        }
        case 'PUT': {
            req.on('data', function (chunk) {
                if (req.headers['content-type'].toLowerCase() == 'application/x-www-form-urlencoded') {
                    formData = formData + chunk.toString();
                }
            });
            req.on('end', function () {
                var params = parseParams(formData);
                params.id = +params.id;
                if (params.id) {
                    readData('comment', function (data) {
                        var flag = false;
                        var target;
                        data.forEach(function (item, index) {
                            if (item.id == params.id) {
                                flag = true;
                                target = index;
                            }
                        });
                        if (flag) {
                            data[target] = params;
                            writeData('comment', data, function () {
                                finish(result);
                            });
                        } else {
                            handleError({message: 'can not find id '+ params.id}, result);
                        }
                    });
                } else {
                    handleError({message: 'no id provided'}, result);
                }
            });
            break;
        }
        case 'GET':
        default: {
            var data = {
                list: [],
                total: 0, 
                pageSize: +params.pageSize || 10, 
                pageNum: +params.pageNum || 1
            };

            params.songId = +params.songId;
            if (params.songId !== '') {
                console.log(path.resolve(__dirname, 'data\\comment.json'),'--------------------------');
                fs.readFile(path.resolve(__dirname, 'data\\comment.json'), function (err, d) {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            fs.writeFile(path.resolve(__dirname, 'data\\comment.json'), '[]', function (err) {
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
                        console.log(parsedData);
                        parsedData = parsedData.filter(function (item) {
                            return item.songId == params.songId;
                        });
                        data.data = parsedData.slice(data.pageSize * (data.pageNum - 1), data.pageSize * data.pageNum);
                        data.total = parsedData.length;
                        result.data = data;
                        finish(result);
                    }
                });
            } else {
                handleError({message: 'no songId provided'}, result);
            }
        }
    }
}

app.on('request', function (req, res) {
    var requestUrl = url.parse(req.url).pathname;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    switch (requestUrl) {

        case '/get-data': {
            handleIssueList(req, res);
            break;
        }
        case '/get-comment': {
            handleCommentList(req, res);
            break;
        }
        default: {
            res.end(JSON.stringify({data: 'ok'}));
        }
    }
});

app.listen(7999);
console.log('server is start at 7999');