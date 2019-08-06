(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('userListController', userListController);
	userListController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService','$filter','$location','uiAddPopupFactory','dataService'];
	function userListController($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService,$filter,$location,uiAddPopupFactory,dataService){
		$rootScope.helpPath="webhelp/index.html#workflow.html"
		$scope.search = { term: '' };
		loadUserList();
		var templateUrl = CJApp.templatePath + '/user/adduser.html';
		
		$rootScope.$on("loadUserList", function(){
			loadUserList();
	     });
		
		$scope.tableParams=[];		
		function loadUserList() {
			var loadUserListarray=[]			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["adm_users"],
					"filtersList":["ausdeleteflag=N"],
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
			uiAddPopupFactory.open(templateUrl, "adduserController","add", "sm", 'static','User','list',0,'Add User');
		}
		$scope.viewAdminUserdetail=function(ev,id){
			ev.preventDefault();
			loadUserDetails(id);
			//$location.path('/workflowList/'+$scope.folderId+'/workflowview/'+id);
		}
//		function loadUserDetails(id) {
//			var loadUserData=[]
//			var data = {
//					"wsCode":"",
//					"columnList":["*"],
//					"keyColumn":"",
//					"tableNameList":["adm_users"],
//					"filtersList":["AUS_USERNAME="+id],
//					"joinsList":[],
//					"moduleCode":"",
//					"objectCode":"",
//					"csrfToken":$rootScope.SessionTokenId
//					};			
//					var url="getData";
//					WebService.addData(	url, data)
//							.then(function(response) {
//								for(var i=0;i<response.length;i++){
//									loadUserData.push(response[i].columnList);
//								}		
//								$scope.tableParams = WebService.drawTable(loadUserData, 10, $scope.search);
//							});
//
//		}
//		
		
		$scope.editRow=function(rId){
			uiAddPopupFactory.open(templateUrl, "edituserController","edit", "sm", 'static','User','list',rId,'Edit User');
		}
$scope.deleteRow=function(rowId){
	
	
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["adm_users"],
					"filtersList":["aususername="+rowId],
					"joinsList":[],
					"moduleCode":"admin",
					"objectCode":"",
					"csrfToken":$rootScope.SessionTokenId
					};			
					var url="adminsetup/deleteData";
					WebService.addData(	url, data)
							.then(function(response) {
								
									$rootScope.$emit("loadUserList");
									 jAlert("User Deleted successfully");
								}
								
								)['catch'](function(reason) {
						            $scope.error =reason;
						            jAlert(reason.failure || "Something went wrong on loading operators");
						        });;

		};
		

		
	}
})();