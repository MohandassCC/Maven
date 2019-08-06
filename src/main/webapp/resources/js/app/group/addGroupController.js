(function () {
	'use strict';
	angular
		.module('importApp').controller('addGroupController', addGroupController)
							.controller('editGroupController', editGroupController);
addGroupController.$inject = [ '$scope', '$rootScope','$filter', '$location', '$uibModal',
                  		'$uibModalInstance', 'WebService', 'item',
                  		 'uiPopupFactory','dataService' ];
editGroupController.$inject = [ '$scope', '$rootScope','$filter', '$location', '$uibModal',
                     		'$uibModalInstance', 'WebService', 'item', 'uiPopupFactory' ,'dataService'];

function addGroupController($scope, $rootScope,$filter, $location, $uibModal,
		$uibModalInstance, WebService, item, uiPopupFactory,dataService) {
	$scope.title = item.title;
	$rootScope.helpPath="webhelp/index.html#workflow.html"
		$scope.search = { term: '' };
	$scope.formdata = {}
		//loadUserList();
		//var templateUrl = CJApp.templatePath + 'user/adduser.html';
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.submit = function() {
		
		var url="adminsetup/saveDetails"
			var data=
		
					{  
					   "wsCode":"",
					   "action":"I",
					   "tableName":"adm_groups",
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
								$uibModalInstance.close();
								jAlert("Group added successfully");
								$rootScope.$emit("loadGroupList");
				})['catch'](function(reason) {
		            // This is set in the event of an error.
		            $scope.error =reason;
		            jAlert(reason.error);
		        });

	}
	
	
}
function editGroupController($scope, $rootScope,$filter, $location, $uibModal,
		$uibModalInstance, WebService, item, uiPopupFactory,dataService){		
	
	$scope.rowId = item.rowId;
	$scope.title = item.title;
	$scope.formdata = {}
	loadGroup();
	
	function loadGroup(){
		
		var data = {
				"wsCode":"",
				"columnList":["*"],
				"keyColumn":"",
				"tableNameList":["adm_groups"],
				"filtersList":["agrcode="+$scope.rowId],
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
	
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.submit = function() {
		
		var url="adminsetup/saveDetails"
			var data=
		
					{  
					   "wsCode":"",
					   "action":"U",
					   "tableName":"adm_groups",
					   "keyColumn":"agrcode",
					   "keyValue":$scope.rowId,
					   "columnValueMap":[ $scope.formdata ],
					   "columnDataTypeMap":{  
//						   "wfd_id":"N",
//						   "wfd_wdt_id":"N",
//						   "wfd_short_name":"S",
//						   "wfd_long_name":"S",
//						   "wfd_executionstatus":"S",
//						   "wfd_pre_configured_flag":"S",
//						   "wfd_diagram_input":"S",
//						   "wfd_pcs_id":"N",
//						   "createuser":"S",
//						   "createdate":"D",
//						   "updateuser":"S",
//						   "updatedate":"D",
//						   "lastmodified":"T",
//						   "fld_id":"N",
//						   "wfd_status":"S"
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
						jAlert("Group edited successfully");
						$uibModalInstance.close();
						$rootScope.$emit("loadGroupList");
					
				})['catch'](function(reason) {
		            // This is set in the event of an error.
		            $scope.error =reason;
		            jAlert(reason.message || 'Failed to edit Group');
		        });
	}
}})();