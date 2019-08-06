(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('customAttributeController', customAttributeController);
	customAttributeController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','$filter','uiAddPopupFactory','WebService','dataService'];

	function customAttributeController($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,$filter,uiAddPopupFactory,WebService,dataService) {
		var templateUrl = CJApp.templatePath + '/customattribute/CustomAttribute.edit.html';
		var newCustomAttrUrl = CJApp.templatePath + '/customattribute/NewCustomAttribute.html';
		loadCapaignAndOfferAttributes();
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		
		function loadCapaignAndOfferAttributes() {
			var loadAttributearray=[]
			var C = "Campaign";
			var O = "Offer";
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["tar_custom_attributes"],
					"filtersList":[],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionTokenId
					};			
					var url="adminsetup/getData";
					WebService.addData(	url, data)
							.then(function(response) {
                                 angular.forEach(response,function(val,key){
									if(val.columnList.atr_object_type == 'C')
										val.columnList.atr_object_type = C;
									else if(val.columnList.atr_object_type == 'O')
										val.columnList.atr_object_type = O;
									if(val.columnList.updatedate == 'null')
										val.columnList.updatedate = '';
								})
								
								angular.forEach(response,function(val,key){
									loadAttributearray.push(val.columnList);
								})
								$scope.tableParams = WebService.drawTable(loadAttributearray, 10, $scope.search);
							});

		}
		$rootScope.$on("refreshCustAttrListPage", function(){
			loadCapaignAndOfferAttributes();
	     });
		$scope.addCustomAttribute = function(){
			uiAddPopupFactory.open(newCustomAttrUrl, "addNewCustomAttributeController","add", "sm", 'static','User','list',0,'Create New Custom Attribute');
		}
		$scope.editCustomAttribute = function(rowId){
			uiAddPopupFactory.open(templateUrl, "editCustomAttributeController","edit", "sm", 'static','User','list',rowId,'Edit Custom Attribute');
		}
		$scope.deleteCustomAttribute = function(atr_id){
			var existsData = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"tta_atr_id",
					"tableNameList":["TAR_TEMPLATE_ATTRIBUTES"],
					"filtersList":["TTA_ATR_ID ="+atr_id],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionTokenId
					};
			var existsUrl="adminsetup/getData";
			WebService.addData(	existsUrl, existsData)
			.then(function(response) {
                if(response == null || response == ""){
                	var url='adminsetup/deleteRowId';
        			var data=
        			 {
        				 "keyValue":atr_id,	
        				 "tableName":"tar_custom_attributes",
        				 "columnheader":"atr_id"
        			 }
        			WebService.addData(url, data).then(function(response) {				
        				jAlert('Deleted Successfully')				
        		})['catch'](function(reason) {
                    $scope.error =reason;
                    jAlert(reason.failure || "Failed to delete ");
                });
        			loadCapaignAndOfferAttributes();
                }
                else{
                	jAlert("Cannot delete as this Custom attribute is added as Template.");
                	return;
                }
			});
			
		}
	}
})();
