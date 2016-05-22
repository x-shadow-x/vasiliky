module.controller('lastestCtrl', ['$scope', function($scope) {

	$scope.list = [
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
		{
			title: 'Nice',
			text: 'Lily likes to play with crayons and pencils'
		},
	];

	$scope.lastIndex = $scope.list.length + 1;

	function loadApp() {
		$('.flipbook').turn({});
	}
	$(function() {
		yepnope({
			test : Modernizr.csstransforms,
			yep: ['src/js/lib/turn.min.js'],
			complete: loadApp
		});
	})
}]);