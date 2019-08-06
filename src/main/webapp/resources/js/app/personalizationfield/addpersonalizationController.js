angular.module('importApp').controller('addpersonalizationController', addpersonalizationController).controller('editpersonalizationController',editpersonalizationController);
						 
							
addpersonalizationController.$inject = ['$scope','$http','$rootScope','$stateParams','$uibModal','$uibModalInstance','uiPopupFactory','WebService','$filter','$location'];

editpersonalizationController.$inject = [ '$scope', '$rootScope', '$filter',
	'$location', '$uibModal', '$uibModalInstance', 'WebService',
	'item', 'uiPopupFactory', 'dataService' ];




	function addpersonalizationController($scope, $http, $rootScope, $stateParams, $uibModal,$uibModalInstance,uiPopupFactory,
			WebService,$filter,$location){
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		$scope.selectionData=[];
		$scope.formData={};
		$scope.title="Add Personalization Field";
		loadDataType();
		
		/*Close popup*/
		$scope.cancel = function() {
			jConfirm('Are you sure you want to close the popup?', 'Confirm', function(confirmed){
			  if(confirmed){
				  $uibModalInstance.dismiss('cancel');
			  }
			});		
		};
		
		function loadDataType() {
			var personalizationAddFormarray=[]
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["IMPORT_LOOKUP_DETAILS"],
					"filtersList":["DLD_DLK_LOOKUP_NAME='DATA_TYPE'"],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
					};			
					var url="adminsetup/getData";
					WebService.addData(	url, data)
							.then(function(response) {
								for(var i=0;i<response.length;i++){
									personalizationAddFormarray.push(response[i].columnList);
								}
								
								//$scope.tableParams = WebService.drawTable(personalizationAddFormarray, 10, $scope.search);
								
								$scope.operatorsList = personalizationAddFormarray;
							});
					

		}
		
		
				
	  	
	  	$scope.submit = function() {
			
			var url="adminsetup/saveDetails"
				var data=
			
						{  
						   "wsCode":"",
						   "action":"I",
						   "tableName":"tar_personalization_field",
						   "keyColumn":"personalization_id",
						   "keyValue":"",
						   "columnValueMap":[ $scope.formData ],
						   "columnDataTypeMap":{  
							   "prf_field_name":"S",
							   "prf_data_type":"S",
							   "prf_desc":"S",
							   "createdate":"D",
							   "createuser":"S",
							   "updatedate":"D",
							   "updateuser":"S",
							   "lastmodified":"T",
							   "personalization_id":"N"
						   },
						   "whereList":[],
						   "moduleCode":"",
						   "objectCode":"",
						   "csrfToken":$rootScope.SessionTokenId,
						   "childGetBean":[]
						}

				console.log(JSON.stringify(data));
				WebService.addData(url, data)
								.then(function(response) {					
			
									$uibModalInstance.close();	
									jAlert("Personalized Field saved successfully")
									
								
					})['catch'](function(reason) {
						$uibModalInstance.close();	
			            // This is set in the event of an error.
			            $scope.error =reason;
			            jAlert(reason.error);
			        });

	 
	  	}
	  	
	  
	
	  	$scope.closepopup = function () {
	  		$scope.$dismiss('close');
	  	}
	  	
	}
	  	
	  	function editpersonalizationController($scope, $rootScope, $filter, $location,
				$uibModal, $uibModalInstance, WebService, item, uiPopupFactory,
				dataService) {

			$scope.currentId = item.rowId;
			$scope.title = item.title;
			$scope.formData = {}
			$scope.title="Edit Personalization Field";
			loadUserData();
			loadDataType();
			
			
			/*Close popup*/
			$scope.cancel = function() {
				jConfirm('Are you sure you want to close the popup?', 'Confirm', function(confirmed){
				  if(confirmed){
					  $uibModalInstance.dismiss('cancel');
				  }
				});		
			};
			
		
			
			function loadDataType() {
				var personalizationAddFormarray=[]
				
				var data = {
						"wsCode":"",
						"columnList":["*"],
						"keyColumn":"",
						"tableNameList":["IMPORT_LOOKUP_DETAILS"],
						"filtersList":["DLD_DLK_LOOKUP_NAME='DATA_TYPE'"],
						"joinsList":[],
						"moduleCode":"",
						"objectCode":"",
						"csrfToken":$rootScope.SessionId
						};			
						var url="adminsetup/getData";
						WebService.addData(	url, data)
								.then(function(response) {
									for(var i=0;i<response.length;i++){
										personalizationAddFormarray.push(response[i].columnList);
									}
																		
									$scope.operatorsList = personalizationAddFormarray;
								});
						

			}

			function loadUserData() {

				var data = {
						"wsCode":"",
						"columnList":["*"],
						"keyColumn":"personalization_id",
						"tableNameList":["tar_personalization_field"],
						"filtersList":["personalization_id="+$scope.currentId],
						"joinsList":[],
						"moduleCode":"",
						"objectCode":"",
						"csrfToken":$rootScope.SessionId
				};
				var url = "adminsetup/getData";
				WebService.addData(url, data).then(function(response) {
					for (var i = 0; i < response.length; i++) {
						$scope.formData = response[0].columnList;
						$scope.pernolizeFieldName=$scope.formData.prf_field_name;
						
					}

				})['catch'](function(reason) {
					// This is set in the event of an error.
					$scope.error = reason;
					jAlert(reason.error || 'Something went wrong on loading data');
				});

			}
			
					
			
			$scope.submit = function() {
				

				var datasource = {
						"wsCode":"",
						"columnList":["*"],
						"keyColumn":"pfm_id",
						"tableNameList":["tar_pers_field_mappings"],
						"filtersList":["pfm_field_id="+$scope.currentId],
						"joinsList":[],
						"moduleCode":"",
						"objectCode":"",
						"csrfToken":$rootScope.SessionId
				};
				var url = "adminsetup/getData";
				WebService.addData(url, datasource).then(function(response) {
					
					if(response.length!=0){
						if($scope.pernolizeFieldName==response[0].columnList.pfm_pmf_prf_field_name){
							jAlert("Personalization Field is used in an offer so cannot be edited ");	
						}
					}else{
						
						var url = "adminsetup/saveDetails"
						var data =

						{
							"wsCode" : "",
							"action" : "U",
							"tableName" : "tar_personalization_field",
							"keyColumn" : "personalization_id",
							"keyValue" : $scope.currentId,
							"columnValueMap" : [ $scope.formData ],
							"columnDataTypeMap" : {
								   "prf_field_name":"S",
								   "prf_data_type":"S",
								   "prf_desc":"S",
								   "createdate":"D",
								   "createuser":"S",
								   "updatedate":"D",
								   "updateuser":"S",
								   "lastmodified":"T",
								   "personalization_id":"N"
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
							jAlert("User edited successfully");
							$rootScope.$emit("loadUserList");

						})['catch'](function(reason) {
							// This is set in the event of an error.
							$scope.error = reason;
							jAlert(reason.message || 'Failed to edit user');
						});
					}
					
				});
					

			}
			
			$scope.resetForm = function() {
				$scope.formData=angular.copy($scope.initialData);
			};
			
			
			
			
	  	}
		
		
	
		