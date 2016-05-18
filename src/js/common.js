var module = angular.module('app', []);

function Hover() {
	var isSupportTouch  = true;
    try{
        isSupportTouch = "ontouchstart" in document ? true:false;
    }catch(e){
        
    }

    if(isSupportTouch) {
    	$('#menu').find('li').bind('touchend', function() {
    		$(this).find('.intro').stop().animate({width: '200px'}, 500);
    	});
    } else {
    	$('#menu').find('li').hover(function() {
    		$(this).find('.intro').stop().animate({width: '200px'}, 500);
    	});
    }
}