(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('targetlevelviewcontroller', targetlevelviewcontroller);
	targetlevelviewcontroller.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService','$filter','$location','uiAddPopupFactory','dataService'];
	
	
	
	function targetlevelviewcontroller($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService,$filter,$location,uiAddPopupFactory,dataService){
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		
		loadtargetlevellist();
		var templateUrl = CJApp.templatePath + '/targetlevel/addtargetlevel.html';
		
		function loadtargetlevellist() {
			var loadtargetlevellistarray=[]
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["tar_target_levels"],
					"filtersList":[],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
					};			
					var url="adminsetup/getData";
					WebService.addData(	url, data)
							.then(function(response) {
								for(var i=0;i<response.length;i++){
									loadtargetlevellistarray.push(response[i].columnList);
								}		
								$scope.tableParams = WebService.drawTable(loadtargetlevellistarray, 10, $scope.search);
							});

		}

		$scope.add=function(){			
			uiAddPopupFactory.open(templateUrl, "addtargetlevelcontroller","add", "sm", 'static','Workflow','list',0,'Add Target Level');
		}
		
    
		
		$scope.editRow=function(rId){
			
			
			uiAddPopupFactory.open(templateUrl, "edittargetlevelcontroller","edit", "sm", 'static','Workflow','list',rId,'Edit Target Level');
		}
		
		
	
	$scope.deletePersonalizeColumn = function(ttl_id) {
							
				
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"ctg_id",
					"tableNameList":["tar_table_catalogue"],
					"filtersList":["ctg_ttl_id="+ttl_id],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
			};
			var url = "adminsetup/getData";
			WebService.addData(url, data).then(function(response) {
				
				if(response.length!=0){
					if(ttl_id==response[0].columnList.ctg_ttl_id){
						
						
						jAlert("Target Level cannot be deleted");	
					}
				}else{
			
				

					var url='adminsetup/deleteRowId';
					var data=
					 {
						 "keyValue":ttl_id,	
						 "tableName":"tar_target_levels",
						 "columnheader":"ttl_id"
					 }
					WebService.addData(url, data).then(function(response) {				
							jAlert('Deleted Successfully')				
					})['catch'](function(reason) {
			            $scope.error =reason;
			            jAlert(reason.failure || "Failed to delete filter column");
			        });
				}
		
				
	//}
})//();
	
}}
})();
		
		