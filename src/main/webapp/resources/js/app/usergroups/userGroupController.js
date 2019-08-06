(function() {
	'use strict';
	angular.module('importApp').controller('userGroupController',
			userGroupController);
	userGroupController.$inject = [ '$scope', '$http', '$rootScope',
			'$stateParams', '$uibModal', 'uiPopupFactory', 'WebService',
			'$filter', '$location', 'uiAddPopupFactory', 'dataService' ];
	function userGroupController($scope, $http, $rootScope, $stateParams,
			$uibModal, uiPopupFactory, WebService, $filter, $location,
			uiAddPopupFactory, dataService) {
		$rootScope.helpPath = "webhelp/index.html#workflow.html"
		$scope.search = {
			term : ''
		};
		loadUserGroupList();
		var templateUrl = CJApp.templatePath + '/usergroups/addusergroup.html';
		$scope.tableParams = [];

		$rootScope.$on("loadUserGroupList", function() {
			loadUserGroupList();
		})
		function loadUserGroupList() {
			var loadUserGroupArray = []
			var data = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "adm_user_groups" ],
				"filtersList" : [],
				"joinsList" : [],
				"moduleCode" : "admin",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId
			};
			var url = "adminsetup/getData";
			WebService.addData(url, data).then(
					function(response) {
						for (var i = 0; i < response.length; i++) {
							loadUserGroupArray.push(response[i].columnList);

						}
						$scope.tableParams = WebService.drawTable(
								loadUserGroupArray, 10, $scope.search);
					});

		}
		$scope.add = function() {
			uiAddPopupFactory.open(templateUrl, "addUserGroupController",
					"add", "sm", 'static', 'User Group', 'list', 0,
					'Add User Group');
		}
		// $scope.openWorkFlow=function(ev,id){
		//
		// ev.preventDefault();
		// $location.path('/workflowList/'+$scope.folderId+'/workflowview/'+id);
		// }
		$scope.editRow = function(rId, param2) {
			uiAddPopupFactory.open(templateUrl, "editUserGroupController",
					"edit", "sm", 'static', 'User Group', 'list', rId + "_"
							+ param2, 'Edit User Group');
		}

		$scope.deleteRow = function(userName, groupName) {

			var data = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "ADM_USER_GROUPS" ],
				"filtersList" : [ "augaususername=" + userName,
						"augagrcode=" + groupName ],
				"joinsList" : [],
				"moduleCode" : "admin",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId
			};
			var url = "adminsetup/deleteData";
			WebService.addData(url, data).then(function(response) {
				jAlert("User Group deleted successfully");
				$rootScope.$emit("loadUserGroupList");
			}

			)['catch'](function(reason) {
				$scope.error = reason;
				jAlert(reason.failure
						|| "Something went wrong on loading operators");
			});
			;

		};

	}
})();