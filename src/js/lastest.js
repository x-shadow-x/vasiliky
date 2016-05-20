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