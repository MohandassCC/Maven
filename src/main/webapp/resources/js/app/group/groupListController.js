(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('groupListController', groupListController);
	groupListController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService','$filter','$location','uiAddPopupFactory','dataService'];
	function groupListController($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService,$filter,$location,uiAddPopupFactory,dataService){
		$rootScope.helpPath="webhelp/index.html#workflow.html"
		$scope.search = { term: '' };
		loadGroupList();
		$rootScope.$on("loadGroupList", function(){
			loadGroupList();
	     });
		
		var templateUrl = CJApp.templatePath + '/group/addgroup.html';
		$scope.tableParams=[];		
		function loadGroupList() {
			var loadUserListarray=[]			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["adm_groups"],
					"filtersList":["agrdeleteflag=N"],
					"joinsList":[],
					"moduleCode":"admin",
					"objectCode":"",
					"csrfToken":$rootScope.SessionTokenId
					};			
					var url="adminsetup/getData";
					WebService.addData(	url, data)
							.then(function(response) {
								for(var i=0;i<response.length;i++){
									loadUserListarray.push(response[i].columnList);
								}		
								$scope.tableParams = WebService.drawTable(loadUserListarray, 10, $scope.search);
							});

		}
		$scope.add=function(){
			uiAddPopupFactory.open(templateUrl, "addGroupController","add", "sm", 'static','Group','list',0,'Add Group');
		}

		$scope.editRow=function(rId){
			uiAddPopupFactory.open(templateUrl, "editGroupController","edit", "sm", 'static','Group','list',rId,'Edit Group');
		}
		
		
		$scope.viewGroup=function(groupCode){
			$location.path("/grouppermission/"+groupCode);
		}
		
		$scope.deleteRow=function(rowId){
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["adm_groups"],
					"filtersList":["agrcode="+rowId],
					"joinsList":[],
					"moduleCode":"admin",
					"objectCode":"",
					"csrfToken":$rootScope.SessionTokenId
					};			
					var url="adminsetup/deleteData";
					WebService.addData(	url, data)
							.then(function(response) {
								 jAlert("Group deleted successfully");
								$rootScope.$emit("loadGroupList");
							}
							
							)['catch'](function(reason) {
					            $scope.error =reason;
					            jAlert(reason.failure || "Something went wrong on loading operators");
					        });;

		};
	
	}
})();