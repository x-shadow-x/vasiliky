var $playBtn;
var $nextBtn;
var $preBtn;
var $stopBtn;
var $muteBtn;
var $firstBtn;
var $lastBtn;
var $shuffleMode;
var $listMode;
var $loopMode;
var myAudio;
var controllArm;
var $cdCover;
var iStartDeg;
var iEndDeg;
var iIncrement;
var songsListIndex; //the index of song in the songslist
var playMode; //list shuffle loop
var shuffleIndex;
var shuffleIndexCount;
var $playBtnI;
var $muteBtnI;
var progressBar;

$().ready(function() {
    init();
    for (var i = 0; i < songsList.length; i++) {
        songsList[i].musicURL = encodeURI(songsList[i].musicURL);
    }
    myAudio.src = decodeURI(songsList[songsListIndex].musicURL);
    /*^_^------------------some event listeners-------------------^_^*/
    myAudio.addEventListener('ended', function() {
        controllArm.style.transform = "rotate(-130deg)"
        if (playMode == "list") {
            songsListIndex++;
            if (songsListIndex >= songsList.length + 1)
                songsListIndex = 0;
        } else if (playMode == "shuffle") {
            songsListIndex = shuffle();
        } else {
            songsListIndex = songsListIndex;
        }
        myAudio.src = decodeURI(songsList[songsListIndex].musicURL);
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
            $myCon.text(songsList[songsListIndex % songsList.length].title + "-" + songsList[songsListIndex % songsList.length].artist);
            var widthline = progressValue * 100;  
            progressBar.style.width = widthline + "%";  
        } else
            $myCon.text("error");
    }, false);
});

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


function initEventClick() {

    $playBtn.click(function() {
        if($playBtnI.hasClass('icon-play')) {
            play();
        } else {
            pause();
        }
    });
    
    $nextBtn.click(function() {
        changeSong("next");
    });
    $preBtn.click(function() {
        changeSong("pre");
    });

    $stopBtn.click(stop);

    function stop() {
        controllArm.style.transform = "rotate(-130deg)"
        $cdCover.removeClass("cdPause");
        $cdCover.removeClass("cdStart");
        myAudio.load();
    }

    $muteBtn.click(function() {
        if($muteBtnI.hasClass('icon-volume-up')) {
            $muteBtnI.removeClass('icon-volume-up').addClass('icon-volume-off');
        } else {
            $muteBtnI.removeClass('icon-volume-off').addClass('icon-volume-up');
        }
        myAudio.muted = !myAudio.muted;
        if (myAudio.muted)
            $(this).css({ "color": 'red' });
        else
            $(this).css({ "color": '#b1b9c6' });
    });
    $firstBtn.click(function() {
        changeSong("first");
    });
    $lastBtn.click(function() {
        changeSong("last");
    });

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

    /*^_^------------------some buttons' hover-------------------^_^*/
    $muteBtn.hover(
        function() {
            if (!myAudio.muted)
                $(this).css({ "color": '#ffffff' });
        },
        function() {
            $(this).css({ "color": '#b1b9c6' });
            if (myAudio.muted)
                $(this).css({ "color": 'red' });
        }
    );
}

function initComponents() {
    $playBtn = $("#playBtn");
    $nextBtn = $("#nextBtn");
    $preBtn = $("#preBtn");
    $stopBtn = $("#stopBtn");
    $muteBtn = $("#muteBtn");
    $muteBtnI = $muteBtn.find('i').eq(0);
    $firstBtn = $("#firstBtn");
    $lastBtn = $("#lastBtn");
    $shuffleMode = $("#shuffleMode");
    $listMode = $("#listMode");
    $loopMode = $("#loopMode");
    myAudio = $("#myAudio")[0];
    controllArm = $("#cdControllerArm")[0];
    $playBtnI = $playBtn.find('i').eq(0);
    $cdCover = $("#cdCover");
    progressBar = $('#progressBar')[0];
    iStartDeg = -90;
    iEndDeg = -115;
    iIncrement = 25;
    songsListIndex = 0; //the index of song in the songslist
    playMode = "list"; //list shuffle loop
    $("#listMode").css({ "color": "#e74d3c" });
    shuffleIndex = [];
    shuffleIndexCount = songsList.length - 1;
    initShuffleGenerator();
}

function initShuffleGenerator() {
    for (var i = 0; i < songsList.length; i++) {
        shuffleIndex[i] = i;
    }
}

function init() {
    initComponents();
    initEventClick();
}

/*^_^------------------some core functions-------------------^_^*/
//var shuffleIndex = [0, 1, 2, 3, 4, 5, 6];
//var shuffleIndexCount = 6;
function shuffle() {
    var tem = getRandom(shuffleIndexCount);
    var tem2 = shuffleIndex[tem];
    shuffleIndex[tem] = shuffleIndex[shuffleIndexCount];

    shuffleIndexCount--;
    if (shuffleIndexCount < 0) {
        shuffleIndexCount = songsList.length;
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
            if (!$cdCover.hasClass("cdStart"))
                $cdCover.addClass("cdStart");
            controllArm.style.transform = "rotate(-130deg)"
            if (whatDirection == "pre") {
                songsListIndex--;
                if (songsListIndex <= -1)
                    songsListIndex = songsList.length;
            } else if (whatDirection == "next") {
                songsListIndex++;
                if (songsListIndex >= songsList.length + 1)
                    songsListIndex = 0;
            } else if (whatDirection == "first") {
                songsListIndex = 0;
            } else if (whatDirection == "last") {
                songsListIndex = songsList.length - 1;
            } else {}
            myAudio.src = decodeURI(songsList[songsListIndex].musicURL);
            myAudio.load();
            myAudio.play();
        }
    }
}

/*^_^------------------some assistant functions-------------------^_^*/
//generate random
function getRandom(n) {
    return Math.floor(Math.random() * n + 1)
}

//convert float/double to percent
Number.prototype.toPercent = function(n) {
    n = n || 2;
    return (Math.round(this * Math.pow(10, n + 2)) / Math.pow(10, n)).toFixed(n) + '%';
};


var songsList = [{
    "title": "行歌",
    "artist": "陈鸿宇",
    "coverURL": "",
    "musicURL": "../../data/music/123.mp3"
}, {
    "title": "行歌",
    "artist": "陈鸿宇",
    "coverURL": "",
    "musicURL": "../../data/music/456.mp3"
}];
