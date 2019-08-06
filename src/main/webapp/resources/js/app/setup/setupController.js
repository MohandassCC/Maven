(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('setupController', setupController);
	setupController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService'];

			//function setupController ($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService) {
				function setupController($scope, $rootScope,$filter, $location, $uibModal,
						$uibModalInstance, WebService, item, uiPopupFactory,dataService) {		
				
				$scope.title="Data Source";
		     	$scope.dataSources=['Table Dictionaries','Table Catalog','Table Mapping'];
		     	console.log("setupCon");
				
				
				
//				function loadsetupmenu(){
//					
//					WebService.GetData("/adminsetup/getsetupmenu").then(function (response) {
//						console.log(response);	
//						
//							 
//							 
//						 });	
//			}
			
				}

})();
	