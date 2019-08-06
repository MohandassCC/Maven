//var navController = 
//navController.$inject = [ '$scope', '$location', 'WebService' ];
//CJApp.controller('navController', navController);
angular.module('CJApp').controller('navController', navController);
navController.$inject = ['$scope', '$location', 'WebService'];

function navController($scope, $location, WebService) {
	angular.extend($scope, {
		navUrl: []
	});
	$scope.isActive = function (destination) {
		return destination === $location.path();
	}
	$scope.MenuItems = [];
	initController();

	function initController() {
		loadMenuItems();
	}

	function loadMenuItems() {
		WebService.GetData('getMenuItems')
			.then(function (menus) {
				$scope.MenuItems = menus;
			});
	}
}