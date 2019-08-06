(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('personalizationframeController', personalizationframeController);
	personalizationframeController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService','$filter','$location','uiAddPopupFactory','dataService'];
	
	
	
	function personalizationframeController($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService,$filter,$location,uiAddPopupFactory,dataService){
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		
		loadDataTypes();
		var templateUrl = CJApp.templatePath + '/personalizationfield/addpersonalizationfield.html';
		
		function loadDataTypes() {
			var personalizationListarray=[]
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["tar_personalization_field"],
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
									personalizationListarray.push(response[i].columnList);
								}		
								$scope.tableParams = WebService.drawTable(personalizationListarray, 10, $scope.search);
							});

		}

		$scope.add=function(){			
			uiAddPopupFactory.open(templateUrl, "addpersonalizationController","add", "sm", 'static','Workflow','list',0,'Add Personalization Field');
		}
		
    
		
		$scope.editRow=function(rId){
			
			
			uiAddPopupFactory.open(templateUrl, "editpersonalizationController","edit", "sm", 'static','Workflow','list',rId,'Edit Personalization Field');
		}
		
		
	
	$scope.deletePersonalizeColumn = function(personalizeId) {
							
				
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"pfm_id",
					"tableNameList":["tar_pers_field_mappings"],
					"filtersList":["pfm_field_id="+personalizeId],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
			};
			var url = "adminsetup/getData";
			WebService.addData(url, data).then(function(response) {
				
				if(response.length!=0){
					if(personalizeId==response[0].columnList.pfm_field_id){
						
						
						jAlert("Personalization Field is used in an offer so cannot be deleted");	
					}
				}else{
			
				

					var url='adminsetup/deleteRowId';
					var data=
					 {
						 "keyValue":personalizeId,	
						 "tableName":"tar_personalization_field",
						 "columnheader":"personalization_id"
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
		
		