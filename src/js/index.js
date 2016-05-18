module.controller('indexCtrl', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.imgLists = [
		'dist/images/index1.jpg',
		'dist/images/index2.jpg',
		'dist/images/index3.jpg',
		'dist/images/index4.jpg'
	];

	var len = $scope.imgLists.length;
	
	function toggleBg(index, imgListObj) {

		setTimeout(function(){
			imgListObj.fadeOut(2000);
			imgListObj.eq(index).fadeIn(3200, toggleBg((index + 1) % len, imgListObj));	
		}, 10000);
	}

	var imgListObj = $('#bg_list').find('li');
	for(var i = 1; i < len; i++) {
		imgListObj.eq(i).hide();
	}
	toggleBg(1, imgListObj);

	$('#menu').find('li').hover(function() {
		$(this).find('.intro').stop().animate({width: '320px'}, 500);
	});

	$('#menu').find('li').mouseleave(function() {
		$(this).find('.intro').stop().animate({width: '0'}, 320);
	});

	$('.title').hover(function() {
		$('.intro.fr').stop().animate({width: '320px'}, 500);
	});

	$('.title').mouseleave(function() {
		$('.intro.fr').stop().animate({width: '0'}, 320);
	});

	$scope.jump = function(index) {
		
	} 

	
}]);