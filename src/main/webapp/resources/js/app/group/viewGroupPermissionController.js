(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('viewGroupPermissionController', viewGroupPermissionController)
		.controller('addGroupPermissionController',addGroupPermissionController);
	
	viewGroupPermissionController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService','$filter','$location','uiAddPopupFactory','dataService'];
	
	addGroupPermissionController.$inject =  [ '$scope', '$rootScope','$filter', '$location', '$uibModal',
	                                   		'$uibModalInstance', 'WebService', 'item', 'uiPopupFactory' ,'dataService'];;

	
	function viewGroupPermissionController($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService,$filter,$location,uiAddPopupFactory,dataService){
		$rootScope.helpPath="webhelp/index.html#workflow.html"
		$scope.search = { term: '' };
		loadGroupPermissionList();
		$rootScope.$on("loadGroupPermissionList", function(){
			loadGroupPermissionList();
	     });
		
		var templateUrl = CJApp.templatePath + '/group/addgroupPermission.html';
		$scope.tableParams=[];		
		function loadGroupPermissionList() {
			var loadUserListarray=[]			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["adm_group_permissions"],
					"filtersList":["agpagrcode="+$stateParams.groupCode,"agpdeleteflag=N"],
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
		$scope.addgrouppermission=function(){
			uiAddPopupFactory.open(templateUrl, "addGroupPermissionController","add", "sm", 'static','Group','list',$stateParams.groupCode,'Add Group Permissions');
		}	
		
$scope.deleteRow=function(groupcode,modulecode){
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["adm_group_permissions"],
					"filtersList":["agpagrcode="+groupcode,"agpapncode="+modulecode],
					"joinsList":[],
					"moduleCode":"admin",
					"objectCode":"",
					"csrfToken":$rootScope.SessionTokenId
					};			
					var url="adminsetup/deleteData";
					WebService.addData(	url, data)
							.then(function(response) {
								 jAlert("Module associated to that group deleted successfully");
								$rootScope.$emit("loadGroupPermissionList");
							}
							
							)['catch'](function(reason) {
					            $scope.error =reason;
					            jAlert(reason.failure || "Something went wrong on loading operators");
					        });;

		};
	}
	
	
	function addGroupPermissionController($scope, $rootScope,$filter, $location, $uibModal,
			$uibModalInstance, WebService, item, uiPopupFactory,dataService){
	
		$scope.title = "Add Group Permissions";
		
		/*Close popup*/
		$scope.cancel = function() {
			//$location.path("/admgroup);
			$uibModalInstance.dismiss('cancel');
		};
		$scope.selectpushcolumngroup = [{
	"amdcode" : "",
		    "amdshortname" : " ",
		    "amdlongname" : " ",
		    "amdurl" : "",
		    "amddescription" : "",
		    "amdjavascript" : "",
		    "amdiconfile" : "",
		    "amdsortorder" : ""
			}]
		
		
		loadmodules();
		function loadmodules() {
			
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["ADM_MODULES"],
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
									$scope.selectpushcolumngroup.push(response[i].columnList);;
								}
								
							});

		}
		
		$scope.displaysecondselectedgroupdata = $scope.selectedaddcolumngroupdata;
		$scope.selectedaddcolumngroupdata = [{
	"amdcode" : "",
		    "amdshortname" : " ",
		    "amdlongname" : " ",
		    "amdurl" : "",
		    "amddescription" : "",
		    "amdjavascript" : "",
		    "amdiconfile" : "",
		    "amdsortorder" : ""
			}];
		
		$scope.moveItem = function (items, from, to) {
			
			items.forEach(function (item) {
				var idx =null //from.indexOf(item);
				var item1=				        
				{
						"amdcode" : "",
					    "amdshortname" : " ",
					    "amdlongname" : " ",
					    "amdurl" : "",
					    "amddescription" : "",
					    "amdjavascript" : "",
					    "amdiconfile" : "",
					    "amdsortorder" : ""
					}
				//];
				for(var i=0;i<from.length;i++)
				{
					if(from[i].amdcode==item)
						{
						item1=from[i];
						idx=i;
						break;
						}
				}
				
				if (idx != -1) {
					
					
					
					//item1=from.get(idx)
					from.splice(idx, 1);
					to.push(item1);
				}
			});
		};
		
		
		$scope.submit = function() {
			var selectedModules={}
			$scope.formdata=[];
			for(var i=1;i<$scope.selectedaddcolumngroupdata.length;i++)
			{
				//selectedModules[i].AGP_APN_CODE=
			var	selectedModule={
					"agpagrcode":item.rowId,
					"agpapncode":$scope.selectedaddcolumngroupdata[i].amdcode,
					"agpdeleteflag":"N",
					"createuser":"",
					"createdate":"",
					"updateuser":"",
					"updatedate":"",
					"lastmodified":""
				}
			
			$scope.formdata.push(selectedModule);
			}
			
			
			
			
			var url="adminsetup/saveDetails"
				
				
				var data=
			
						{  
						   "wsCode":"",
						   "action":"I",
						   "tableName":"adm_group_permissions",
						   "keyColumn":"",
						   "keyValue":"",
						   "columnValueMap":$scope.formdata,
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
									jAlert("Group Permission added successfully");
									$rootScope.$emit("loadGroupPermissionList");
					})['catch'](function(reason) {
			            // This is set in the event of an error.
			            $scope.error =reason;
			            jAlert(reason.error);
			        });

		}
		
		
		
		
	}

	
})();