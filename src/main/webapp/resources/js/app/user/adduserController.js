(function() {
	'use strict';
	angular.module('importApp').controller('adduserController',
			adduserController).controller('edituserController',
			edituserController);
	adduserController.$inject = [ '$scope', '$rootScope', '$filter',
			'$location', '$uibModal', '$uibModalInstance', 'WebService',
			'item', 'uiPopupFactory', 'dataService' ];
	edituserController.$inject = [ '$scope', '$rootScope', '$filter',
			'$location', '$uibModal', '$uibModalInstance', 'WebService',
			'item', 'uiPopupFactory', 'dataService' ];

	function adduserController($scope, $rootScope, $filter, $location,
			$uibModal, $uibModalInstance, WebService, item, uiPopupFactory,
			dataService) {
		$scope.title = item.title;
		$rootScope.helpPath = "webhelp/index.html#workflow.html"
		$scope.search = {
			term : ''
		};
		$scope.formdata = {}
		// loadUserList();
		// var templateUrl = CJApp.templatePath + 'user/adduser.html';
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
		  $scope.check_pass=function(password,cpassword)
		{
			
	        if (password != cpassword) {
	        	jAlert("Passwords do not match.");
	           // return false;
	        }
	       // return true;
		}
		$scope.submit = function() {

			var url = "adminsetup/saveDetails"
			var data =

			{
				"wsCode" : "",
				"action" : "I",
				"tableName" : "adm_users",
				"keyColumn" : "",
				"keyValue" : "",
				"columnValueMap" : [ $scope.formdata ],
				"columnDataTypeMap" : {
				/*
				 * "wfd_id":"N", "wfd_wdt_id":"N", "wfd_short_name":"S",
				 * "wfd_long_name":"S", "wfd_executionstatus":"S",
				 * "wfd_pre_configured_flag":"S", "wfd_diagram_input":"S",
				 * "wfd_pcs_id":"N", "createuser":"S", "createdate":"D",
				 * "updateuser":"S", "updatedate":"D", "lastmodified":"T",
				 * "fld_id":"N", "wfd_status":"S"
				 */
				},
				"whereList" : [],
				"moduleCode" : "admin",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId,
				"childGetBean" : []
			}

			console.log(JSON.stringify(data));
			WebService.addData(url, data).then(function(response) {
				$uibModalInstance.close();
				jAlert("User Added successfully");
				$rootScope.$emit("loadUserList");
			})['catch'](function(reason) {
				// This is set in the event of an error.
				$scope.error = reason;
				jAlert(reason.error);
			});

		}

//		function addWorkFlowtoMongoDb(id) {
//			var url = "workflow/add/" + id;
//			WebService.addData(url).then(
//					function(response) {
//						$uibModalInstance.close();
//						jAlert("Workflow Created Successfully")
//						$location.path('workflowList/'
//								+ $scope.formData['fld_id'] + '/workflowview/'
//								+ response.orchestratorid);
//					})['catch'](function(reason) {
//				// This is set in the event of an error.
//				$scope.error = reason;
//				jAlert("Error while creating workflow")
//			});
//		}
	}
	function edituserController($scope, $rootScope, $filter, $location,
			$uibModal, $uibModalInstance, WebService, item, uiPopupFactory,
			dataService) {

		$scope.rowId = item.rowId;
		$scope.title = item.title;
		$scope.formdata = {}
		loadUserData();

		function loadUserData() {

			var data = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "adm_users".toUpperCase() ],
				"filtersList" : [ "aususername=" + $scope.rowId ],
				"joinsList" : [],
				"moduleCode" : "admin",
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

			var url = "adminsetup/saveDetails"
			var data =

			{
				"wsCode" : "",
				"action" : "U",
				"tableName" : "adm_users",
				"keyColumn" : "aususername",
				"keyValue" : $scope.rowId,
				"columnValueMap" : [ $scope.formdata ],
				"columnDataTypeMap" : {
				// "wfd_id":"N",
				// "wfd_wdt_id":"N",
				// "wfd_short_name":"S",
				// "wfd_long_name":"S",
				// "wfd_executionstatus":"S",
				// "wfd_pre_configured_flag":"S",
				// "wfd_diagram_input":"S",
				// "wfd_pcs_id":"N",
				// "createuser":"S",
				// "createdate":"D",
				// "updateuser":"S",
				// "updatedate":"D",
				// "lastmodified":"T",
				// "fld_id":"N",
				// "wfd_status":"S"
				},
				"whereList" : [],
				"moduleCode" : "admin",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId,
				"childGetBean" : []
			}

			console.log(JSON.stringify(data));
			WebService.addData(url, data).then(function(response) {
				
				$uibModalInstance.close();
				jAlert("User edited successfully");
				$rootScope.$emit("loadUserList");

			})['catch'](function(reason) {
				// This is set in the event of an error.
				$scope.error = reason;
				jAlert(reason.message || 'Failed to edit user');
			});
		}
	}
})();