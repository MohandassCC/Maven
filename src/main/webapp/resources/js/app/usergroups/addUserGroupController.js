(function () {
	'use strict';
	angular
		.module('importApp').controller('addUserGroupController', addUserGroupController)
							.controller('editUserGroupController', editUserGroupController);
addUserGroupController.$inject = [ '$scope', '$rootScope','$filter', '$location', '$uibModal',
                  		'$uibModalInstance', 'WebService', 'item',
                  		 'uiPopupFactory','dataService' ];
editUserGroupController.$inject = [ '$scope', '$rootScope','$filter', '$location', '$uibModal',
                     		'$uibModalInstance', 'WebService', 'item', 'uiPopupFactory' ,'dataService'];

function addUserGroupController($scope, $rootScope,$filter, $location, $uibModal,
		$uibModalInstance, WebService, item, uiPopupFactory,dataService) {
	$scope.title = item.title;
	$rootScope.helpPath="webhelp/index.html#workflow.html"
		$scope.search = { term: '' };
	
		//loadUserList();
		//var templateUrl = CJApp.templatePath + 'user/adduser.html';
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	loadUserData();
	loadGroup();	
	function loadUserData() {
		$scope.userList=[]
		var data = {
			"wsCode" : "",
			"columnList" : [ "*" ],
			"keyColumn" : "",
			"tableNameList" : [ "adm_users".toUpperCase() ],
			"filtersList" : [],
			"joinsList" : [],
			"moduleCode" : "admin",
			"objectCode" : "",
			"csrfToken" : $rootScope.SessionTokenId
		};
		var url = "adminsetup/getData";
		WebService.addData(url, data).then(function(response) {
			for (var i = 0; i < response.length; i++) {
				$scope.userList.push(response[i].columnList);
			}

		})['catch'](function(reason) {
			// This is set in the event of an error.
			$scope.error = reason;
			jAlert(reason.error || 'Something went wrong on loading data');
		});

	}

	function loadGroup(){
		$scope.groupList=[];
		var data = {
				"wsCode":"",
				"columnList":["*"],
				"keyColumn":"",
				"tableNameList":["adm_groups"],
				"filtersList":[],
				"joinsList":[],
				"moduleCode":"admin",
				"objectCode":"",
				"csrfToken":$rootScope.SessionTokenId
				};			
				var url="adminsetup/getData";
				WebService.addData(	url, data)
						.then(function(response) {
							for(var i=0;i<response.length;i++){
								$scope.groupList.push(response[i].columnList);
							}		
							
						})['catch'](function(reason) {
				            // This is set in the event of an error.
				            $scope.error =reason;
				            jAlert(reason.error || 'Something went wrong on loading data');
				        });

	}
	$scope.formdata = {

	}
	$scope.submit = function() {	
		
		var url="adminsetup/saveDetails"
			var data=
		
					{  
					   "wsCode":"",
					   "action":"I",
					   "tableName":"adm_user_groups",
					   "keyColumn":"",
					   "keyValue":"",
					   "columnValueMap":[ $scope.formdata ],
					   "columnDataTypeMap":{  
						   /*"wfd_id":"N",
						   "wfd_wdt_id":"N",
						   "wfd_short_name":"S",
						   "wfd_long_name":"S",
						   "wfd_executionstatus":"S",
						   "wfd_pre_configured_flag":"S",
						   "wfd_diagram_input":"S",
						   "wfd_pcs_id":"N",
						   "createuser":"S",
						   "createdate":"D",
						   "updateuser":"S",
						   "updatedate":"D",
						   "lastmodified":"T",
						   "fld_id":"N",
						   "wfd_status":"S"*/
					   },
					   "whereList":[],
					   "moduleCode":"admin",
					   "objectCode":"",
					   "csrfToken":$rootScope.SessionTokenId,
					   "childGetBean":[]
					}

			console.log(JSON.stringify(data));
			WebService.addData(url, data)
							.then(function(response) {					
								jAlert("User Group added successfully");
								$uibModalInstance.close();
								$rootScope.$emit("loadUserGroupList");
				})['catch'](function(reason) {
		            // This is set in the event of an error.
		            $scope.error =reason;
		            jAlert(reason.error);
		        });

	}
	
	
}
function editUserGroupController($scope, $rootScope,$filter, $location, $uibModal,
		$uibModalInstance, WebService, item, uiPopupFactory,dataService){		
	
	$scope.rowId = item.rowId;
	
	$scope.title = item.title;
	$scope.formdata = {}
	$scope.formdata = {
			
	}
		//loadUserList();
		//var templateUrl = CJApp.templatePath + 'user/adduser.html';
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	loadUserData();
	loadGroup();	
	function loadUserData() {
		$scope.userList=[]
		var data = {
			"wsCode" : "",
			"columnList" : [ "*" ],
			"keyColumn" : "",
			"tableNameList" : [ "adm_users".toUpperCase() ],
			"filtersList" : [],
			"joinsList" : [],
			"moduleCode" : "admin",
			"objectCode" : "",
			"csrfToken" : $rootScope.SessionTokenId
		};
		var url = "adminsetup/getData";
		WebService.addData(url, data).then(function(response) {
			for (var i = 0; i < response.length; i++) {
				$scope.userList.push(response[i].columnList);
			}

		})['catch'](function(reason) {
			// This is set in the event of an error.
			$scope.error = reason;
			jAlert(reason.error || 'Something went wrong on loading data');
		});

	}

	function loadGroup(){
		$scope.groupList=[];
		var data = {
				"wsCode":"",
				"columnList":["*"],
				"keyColumn":"",
				"tableNameList":["adm_groups"],
				"filtersList":[],
				"joinsList":[],
				"moduleCode":"admin",
				"objectCode":"",
				"csrfToken":$rootScope.SessionTokenId
				};			
				var url="adminsetup/getData";
				WebService.addData(	url, data)
						.then(function(response) {
							for(var i=0;i<response.length;i++){
								$scope.groupList.push(response[i].columnList);
							}		
							
						})['catch'](function(reason) {
				            // This is set in the event of an error.
				            $scope.error =reason;
				            jAlert(reason.error || 'Something went wrong on loading data');
				        });

	}	
	loaduserGroupData();
	
	function loaduserGroupData(rowID){
		var parameter = item.rowId;
		$scope.rowId=parameter.split("_")[0];
		var param2=parameter.split("_")[1];
		$scope.param=param2;
		var data = {
				"wsCode":"",
				"columnList":["*"],
				"keyColumn":"",
				"tableNameList":["adm_user_groups"],
				"filtersList":["augaususername="+$scope.rowId,"augagrcode="+param2],
				"joinsList":[],
				"moduleCode":"admin",
				"objectCode":"",
				"csrfToken":$rootScope.SessionTokenId
				};					
				var url="adminsetup/getData";
				WebService.addData(	url, data)
						.then(function(response) {
							for(var i=0;i<response.length;i++){
								$scope.formdata=response[0].columnList;
							}		
							
						})['catch'](function(reason) {
				            // This is set in the event of an error.
				            $scope.error =reason;
				            jAlert(reason.error || 'Something went wrong on loading data');
				        });

	}	
	$scope.submit = function() {		
		var url="adminsetup/saveDetails"
			var data=
		
					{  
					   "wsCode":"",
					   "action":"U",
					   "tableName":"adm_user_groups",
					   "keyColumn":"",
					   "keyValue":"",
					   "columnValueMap":[ $scope.formdata ],
					   "columnDataTypeMap":{  
						   /*"wfd_id":"N",
						   "wfd_wdt_id":"N",
						   "wfd_short_name":"S",
						   "wfd_long_name":"S",
						   "wfd_executionstatus":"S",
						   "wfd_pre_configured_flag":"S",
						   "wfd_diagram_input":"S",
						   "wfd_pcs_id":"N",
						   "createuser":"S",
						   "createdate":"D",
						   "updateuser":"S",
						   "updatedate":"D",
						   "lastmodified":"T",
						   "fld_id":"N",
						   "wfd_status":"S"*/
					   },
					   "whereList":["augaususername="+$scope.rowId,"augagrcode="+$scope.param],
					   "moduleCode":"admin",
					   "objectCode":"",
					   "csrfToken":$rootScope.SessionTokenId,
					   "childGetBean":[]
					}

			console.log(JSON.stringify(data));
			WebService.addData(url, data)
							.then(function(response) {					
								jAlert("User Group edited successfully");
								$uibModalInstance.close();
								$rootScope.$emit("loadUserGroupList");
				})['catch'](function(reason) {
		            // This is set in the event of an error.
		            $scope.error =reason;
		            jAlert(reason.error);
		        });

	}
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
}})();