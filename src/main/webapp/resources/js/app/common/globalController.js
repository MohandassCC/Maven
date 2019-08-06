var globalController = function($scope) {
	$scope.global = {};
	$scope.global.navUrl = "resources/js/app/common/nav.html"
}
globalController.$inject = [ '$scope' ];
CJApp.controller('globalController', globalController);