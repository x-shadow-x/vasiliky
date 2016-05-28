module.controller('songCtrl', ['$scope', '$http', 'request', function($scope, $http, request) {

    var $nextBtn;
    var $preBtn;
    var $stopBtn;
    var $shuffleMode;
    var $listMode;
    var $loopMode;
    var myAudio;
    var controllArm;
    var $cdCover;
    var iStartDeg;
    var iEndDeg;
    var iIncrement;
    var playMode; //list shuffle loop
    var shuffleIndex;
    var shuffleIndexCount;
    var $playBtnI;
    var $muteBtnI;
    var progressBar;

    $scope.songsListIndex = getQueryObject().id - 1;
    console.log($scope.songsListIndex);

    function init() {
        initComponents();
        initEventClick();

        for (var i = 0; i < $scope.songsList.length; i++) {
            $scope.songsList[i].musicURL = encodeURI($scope.songsList[i].musicURL);
        }

        myAudio.src = decodeURI($scope.songsList[$scope.songsListIndex].musicURL);

        myAudio.addEventListener('ended', function() {
            controllArm.style.transform = "rotate(-130deg)"
            if (playMode == "list") {
                $scope.songsListIndex++;
                if ($scope.songsListIndex >= $scope.songsList.length + 1)
                    $scope.songsListIndex = 0;
            } else if (playMode == "shuffle") {
                $scope.songsListIndex = shuffle();
            } else {
                $scope.songsListIndex = $scope.songsListIndex;
            }
            myAudio.src = decodeURI($scope.songsList[$scope.songsListIndex].musicURL);
            myAudio.load();
            iStartDeg = -90;
            iEndDeg = -115;
            myAudio.play();
        }, false);

        myAudio.addEventListener("timeupdate", function() {
            var $myCon = $("#myConsole");
            if (!isNaN(myAudio.duration)) {
                var progressValue = myAudio.currentTime / myAudio.duration;
                if (myAudio.paused)
                    return; //confrim the controllerArm can be rotated immediately
                iStartDeg = -90 - 25 * progressValue;
                controllArm.style.transform = "rotate(" + iStartDeg + "deg)";
                $myCon.text($scope.songsList[$scope.songsListIndex % $scope.songsList.length].title + "-" + $scope.songsList[$scope.songsListIndex % $scope.songsList.length].artist);
                var widthline = progressValue * 100;
                progressBar.style.width = widthline + "%";
            } else
                $myCon.text("error");
        }, false);
    }

    function play() {
        $playBtnI.removeClass('icon-play').addClass('icon-pause');

        iIncrement = (iStartDeg - iEndDeg);
        controllArm.style.transform = "rotate(" + iStartDeg + "deg)";
        if ($cdCover.hasClass("cdPause")) {
            $cdCover.removeClass("cdPause");
            $cdCover.removeClass("cdStart");
        }
        if (!$cdCover.hasClass("cdStart"))
            $cdCover.addClass("cdStart");
        myAudio.play();

    }

    function pause() {
        $playBtnI.removeClass('icon-pause').addClass('icon-play');

        controllArm.style.transform = "rotate(-130deg)"
        if (!$cdCover.hasClass("cdPause"))
            $cdCover.addClass("cdPause");
        myAudio.pause();
    }

    function reload() {
        $scope.pageSearchList = {
        pn: 1,//当前显示的是第几页
        ps: 10,//每页显示多少条
        pl: 5,//分页栏显示页数
        songId: $scope.songsListIndex + 1,
        switch: true //用以在需要reload时做pageSearchList的修改~以便在pagination.js的指令中watch~从而调用getOrderList分页函数
    };
    }

    $scope.handlePreBtn = function() {
        changeSong("pre");
    }

    $scope.handlePlayBtn = function() {
        if ($playBtnI.hasClass('icon-play')) {
            play();
         } else {
            pause();
         }
    }

    $scope.handleNextBtn = function() {
        changeSong("next");
    }

    $scope.handleStopBtn = function() {
        controllArm.style.transform = "rotate(-130deg)"
        $cdCover.removeClass("cdPause");
        $cdCover.removeClass("cdStart");
        myAudio.load();
    }

    $scope.handleMuteBtn = function() {
        if ($muteBtnI.hasClass('icon-volume-up')) {
            $muteBtnI.removeClass('icon-volume-up').addClass('icon-volume-off');
        } else {
            $muteBtnI.removeClass('icon-volume-off').addClass('icon-volume-up');
        }
        myAudio.muted = !myAudio.muted;
    }

    function initEventClick() {

        $shuffleMode.click(function() {
            playMode = "shuffle";
            $("#playMode").find("div").css({ "color": "#b1b9c6" });
            $(this).css({ "color": "#e74d3c" });
        });
        $listMode.click(function() {
            playMode = "list";
            $("#playMode").find("div").css({ "color": "#b1b9c6" });
            $(this).css({ "color": "#e74d3c" });
        });
        $loopMode.click(function() {
            playMode = "loop";
            $("#playMode").find("div").css({ "color": "#b1b9c6" });
            $(this).css({ "color": "#e74d3c" });
        });
    }

    function initComponents() {
        $nextBtn = $("#nextBtn");
        $preBtn = $("#preBtn");
        $stopBtn = $("#stopBtn");
        $muteBtnI = $("#muteBtn").find('i').eq(0);
        $shuffleMode = $("#shuffleMode");
        $listMode = $("#listMode");
        $loopMode = $("#loopMode");
        myAudio = $("#myAudio")[0];
        controllArm = $("#cdControllerArm")[0];
        $playBtnI = $('#playBtn').find('i').eq(0);
        $cdCover = $("#cdCover");
        iStartDeg = -90;
        iEndDeg = -115;
        iIncrement = 25;
        playMode = "list"; //list shuffle loop
        isMouseDown = false;

        progressBar = $('#progressBar')[0];
        $progressBarBox = $('#progressBarBox');
        progressBarWidth = $progressBarBox.width();
        $progressBarNode = $('#progressBarNode');
        console.log($progressBarNode);


        $("#listMode").css({ "color": "#e74d3c" });
        shuffleIndex = [];
        shuffleIndexCount = $scope.songsList.length - 1;
        initShuffleGenerator();
    }

    function initShuffleGenerator() {
        for (var i = 0; i < $scope.songsList.length; i++) {
            shuffleIndex[i] = i;
        }
    }

    //var shuffleIndex = [0, 1, 2, 3, 4, 5, 6];
    //var shuffleIndexCount = 6;
    function shuffle() {
        var tem = getRandom(shuffleIndexCount);
        var tem2 = shuffleIndex[tem];
        shuffleIndex[tem] = shuffleIndex[shuffleIndexCount];

        shuffleIndexCount--;
        if (shuffleIndexCount < 0) {
            shuffleIndexCount = $scope.songsList.length;
        }
        return tem2;
    }

    function changeSong(whatDirection) {
        if (myAudio.currentTime != 0) {
            if (!myAudio.paused) {
                if ($cdCover.hasClass("cdPause")) {
                    $cdCover.removeClass("cdPause");
                    $cdCover.removeClass("cdStart");
                }
                if (!$cdCover.hasClass("cdStart")) {
                    $cdCover.addClass("cdStart");
                }
                    
                controllArm.style.transform = "rotate(-130deg)";
                if (whatDirection == "pre") {
                    $scope.songsListIndex--;
                    if ($scope.songsListIndex < 0)
                        $scope.songsListIndex = $scope.songsList.length - 1;
                } else if (whatDirection == "next") {
                    $scope.songsListIndex++;
                    if ($scope.songsListIndex >= $scope.songsList.length)
                        $scope.songsListIndex = 0;
                } else if (whatDirection == "first") {
                    $scope.songsListIndex = 0;
                } else if (whatDirection == "last") {
                    $scope.songsListIndex = $scope.songsList.length - 1;
                } else {}
                reload();
                myAudio.src = decodeURI($scope.songsList[$scope.songsListIndex].musicURL);
                myAudio.load();
                myAudio.play();
            }
        }
    }

    //generate random
    function getRandom(n) {
        return Math.floor(Math.random() * n + 1)
    }

    //convert float/double to percent
    Number.prototype.toPercent = function(n) {
        n = n || 2;
        return (Math.round(this * Math.pow(10, n + 2)) / Math.pow(10, n)).toFixed(n) + '%';
    };

    function getQueryObject() {
	    var url = window.location.href;
	    var search = url.substring(url.lastIndexOf("?") + 1);
	    var obj = {};
	    var reg = /([^?&=]+)=([^?&=]*)/g;
	    search.replace(reg, function (rs, $1, $2) {
	        var name = decodeURIComponent($1);
	        var val = decodeURIComponent($2);                
	        val = String(val);
	        obj[name] = val;
	        return rs;
	    });
	    return obj;
	}

	function getData(param) {
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
	}

	request({
		url:'../../data/song-list.json',
		method:'GET'
	}).then(function(rs) {
        $scope.songsList = rs.data;
        init();
    }, function(err) {
        console(err);
    });

	$scope.pageSearchList = {
        pn: 1,//当前显示的是第几页
        ps: 10,//每页显示多少条
        pl: 5,//分页栏显示页数
        songId: $scope.songsListIndex + 1,
        switch: true //用以在需要reload时做pageSearchList的修改~以便在pagination.js的指令中watch~从而调用getOrderList分页函数
    };

    /**
     * 分页组建回调函数
     */
    $scope.getOrderList = function(args, success){

        var param = {
            url: 'http://127.0.0.1:7999/get-comment',
			method: 'GET',
			params: args
        };

        request(param).then(function(rs) {
            console.log(rs);

			if (rs.data) {
                pn = $scope.pageSearchList.pn;
                rs.pa = {
                    total: rs.data.total,//rs.data.params.total,
                    pn: $scope.pageSearchList.pn,//当前显示的是第几页
                    ps: $scope.pageSearchList.ps //每页显示多少条
                };
                success(rs);
                console.log(rs);
                $scope.commentLists = rs.data.data[0].data;
                console.log($scope.commentLists);
            }	
		}, function(err)  {
			console.log(err);
		});
    };
}]);
