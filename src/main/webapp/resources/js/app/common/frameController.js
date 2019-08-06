(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('frameController', frameController);
	frameController.$inject = ['$scope','task'];
	function frameController($scope,task){				
		$scope.text="text";	
		$scope.url=task;
	}
})();