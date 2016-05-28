/**
 * 请求数据服务
 */
module.factory('request', function ($http, $q) {
    return function (option) {
        option.url = option.url + '?timeStamp=' + (new Date()).valueOf();
        return $http(option).then(function (response) {
            var defer = $q.defer();

            if(angular.isUndefined(response)){
                defer.reject({
                    type: -1,
                    data: response
                });
            } else {
                defer.resolve(response.data);
            }
            return defer.promise;
        }, function (err) {
            throw {
                type: -1,
                data: err
            };
        });
    };
});
