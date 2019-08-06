(function() {
	'use strict';
	angular.module('importApp').controller('editCustomAttributeController',
			editCustomAttributeController);
	editCustomAttributeController.$inject = [ '$scope', '$rootScope', '$filter',
			'$location', '$uibModal', '$uibModalInstance', 'WebService',
			'item', 'uiPopupFactory', 'dataService' ];

	function editCustomAttributeController($scope, $rootScope, $filter, $location,
			$uibModal, $uibModalInstance, WebService, item, uiPopupFactory,
			dataService) {

		$scope.rowId = item.rowId;
		$scope.title = item.title;
		$scope.formdata = {}
		loadUserData();

		$scope.loadLookUpCode = function(loadLookUpCode){
			$scope.maxLength = true;
			$scope.lookUparray=[]
			var data = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "BAS_LOOKUPS" ],
				"filtersList" : [ "DLK_SYSTEM_FLAG = 'N'" ],
				"joinsList" : [],
				"moduleCode" : "",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId
			};
			var url = "adminsetup/getData";
			
			WebService.addData(url, data).then(function(response) {
				
				angular.forEach(response,function(val,key){
					$scope.lookUparray.push(val.columnList.dlk_lookup_name);
				})

			})['catch'](function(reason) {
				// This is set in the event of an error.
				$scope.error = reason;
				jAlert(reason.error || 'Something went wrong on loading data');
			});

		}
		
		function loadUserData() {

			var data = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "TAR_CUSTOM_ATTRIBUTES" ],
				"filtersList" : [ "ATR_ID=" + $scope.rowId ],
				"joinsList" : [],
				"moduleCode" : "",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId
			};
			var url = "adminsetup/getData";
			WebService.addData(url, data).then(function(response) {
				for (var i = 0; i < response.length; i++) {
					$scope.formdata = response[0].columnList;
					
				}

			})['catch'](function(reason) {
				// This is set in the event of an error.
				$scope.error = reason;
				jAlert(reason.error || 'Something went wrong on loading data');
			});

		}

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
		$scope.submit = function() {
			
			var existsData = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"tta_atr_id",
					"tableNameList":["TAR_TEMPLATE_ATTRIBUTES"],
					"filtersList":["TTA_ATR_ID ="+$scope.rowId],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionTokenId
					};
			var existsUrl="adminsetup/getData";
			WebService.addData(	existsUrl, existsData)
			.then(function(response) {
				
                if(response == null || response == ""){
                	var url = "adminsetup/saveDetails"
            			var data =

            			{
            				"wsCode" : "",
            				"action" : "U",
            				"tableName" : "TAR_CUSTOM_ATTRIBUTES",
            				"keyColumn" : "atr_id",
            				"keyValue" : $scope.rowId,
            				"columnValueMap" : [ $scope.formdata ],
            				"columnDataTypeMap" : {
            					 "atr_id":"N",
            					 "atr_name":"S",
            					 "atr_long_name":"S",
            					 "atr_object_type":"S",
            					 "atr_display_group":"S",
            					 "atr_sort_order":"N",
            					 "atr_data_type":"S",
            					 "atr_max_length":"N",
            					 "atr_min_value":"N",
            					 "atr_max_value":"N",
            					 "atr_format":"S",
            					 "atr_lookup_code":"S",
            					 "createuser":"S",
            					 "createdate":"D",
            					 "updateuser":"S",
            					 "updatedate":"D",
            				     "lastmodified":"T",
            					 "atr_parameterized_value":"S"
            				},
            				"whereList" : [],
            				"moduleCode" : "",
            				"objectCode" : "",
            				"csrfToken" : $rootScope.SessionTokenId,
            				"childGetBean" : []
            			}

            			console.log(JSON.stringify(data));
            			WebService.addData(url, data).then(function(response) {
            				
            				$uibModalInstance.close();
            				jAlert("Custom Attribute edited successfully");
            				$rootScope.$emit("refreshCustAttrListPage");

            			})['catch'](function(reason) {
            				// This is set in the event of an error.
            				$scope.error = reason;
            				jAlert(reason.message || 'Failed to edit user');
            			});
                }else{
                	jAlert("Cannot edit as this Custom attribute is added as Template.");
                	return;
                }
			});
		}
	}
})();