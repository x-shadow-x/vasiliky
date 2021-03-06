module.controller('lastestCtrl', ['$scope', 'request', '$timeout', function($scope, request, $timeout) {

	$scope.list = [];

	request({
		url: '../../data/song-list.json',
		method: 'GET'
	}).then(function(rs) {
		$scope.list = rs.data;
		$scope.lastIndex = $scope.list.length + 1;
		yepnope({
			test: Modernizr.csstransforms,
			yep: ['src/js/lib/turn.min.js'],
			complete: loadApp
		});
		$timeout(function() {
			$('img').lazyload({
				'container': '#content',
				'load': function() {
					$(this).parent().find('.hover').hide();
				}
			});
		}, 500);
	}, function(err) {
		console(err);
	});

	function loadApp() {
		$('.flipbook').turn({});
		$('.flipbook').bind('touchmove', function(e) {
			e.stopPropagation();
		})
	}
	$(function() {
		setTimeout(function() {
			$('#content').css('height', $(window).height()).perfectScrollbar();
		});
	})
}]);