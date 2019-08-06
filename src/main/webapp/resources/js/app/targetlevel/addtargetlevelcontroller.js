angular.module('importApp').controller('addtargetlevelcontroller', addtargetlevelcontroller).controller('edittargetlevelcontroller',edittargetlevelcontroller);
						 
							
addtargetlevelcontroller.$inject = ['$scope','$http','$rootScope','$stateParams','$uibModal','$uibModalInstance','uiPopupFactory','WebService','$filter','$location'];

edittargetlevelcontroller.$inject = [ '$scope', '$rootScope', '$filter',
	'$location', '$uibModal', '$uibModalInstance', 'WebService',
	'item', 'uiPopupFactory', 'dataService' ];




	function addtargetlevelcontroller($scope, $http, $rootScope, $stateParams, $uibModal,$uibModalInstance,uiPopupFactory,
			WebService,$filter,$location){
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		$scope.selectionData=[];
		$scope.formData={};
		$scope.title="Add Target Level";
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
			var targetlevelAddFormarray=[]
			
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
									targetlevelAddFormarray.push(response[i].columnList);
								}
								
								//$scope.tableParams = WebService.drawTable(personalizationAddFormarray, 10, $scope.search);
								
								$scope.operatorsList = targetlevelAddFormarray;
							});
					

		}
		
		
				
	  	
	  	$scope.submit = function() {
			
			var url="adminsetup/saveDetails"
				var data=
			
						{  
						   "wsCode":"",
						   "action":"I",
						   "tableName":"tar_target_levels",
						   "keyColumn":"ttl_id",
						   "keyValue":"",
						   "columnValueMap":[ $scope.formData ],
						   "columnDataTypeMap":{  
							   "ttl_id":"N",
							   "ttl_name":"S",
							   "ttl_data_type":"S",
							   "createuser":"S",
							   "createdate":"D",
							   "updateuser":"S",
							   "updatedate":"D",
							   "lastmodified":"T"
							  
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
									jAlert("Target Level saved successfully")
									
								
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
	  	
	  	function edittargetlevelcontroller($scope, $rootScope, $filter, $location,
				$uibModal, $uibModalInstance, WebService, item, uiPopupFactory,
				dataService) {

			$scope.currentId = item.rowId;
			$scope.title = item.title;
			$scope.formData = {}
			$scope.title="Edit Target Level";
			loadDataType();
			loadUserData();
			
			
			
			/*Close popup*/
			$scope.cancel = function() {
				jConfirm('Are you sure you want to close the popup?', 'Confirm', function(confirmed){
				  if(confirmed){
					  $uibModalInstance.dismiss('cancel');
				  }
				});		
			};
			
		
			
			function loadDataType() {
				var targetlevelAddFormarray=[]
				
				var data = {
						"wsCode":"",
						"columnList":["*"],
						"keyColumn":"",
						"tableNameList":["import_lookup_details"],
						"filtersList":["dld_dlk_lookup_name='DATA_TYPE'"],
						"joinsList":[],
						"moduleCode":"",
						"objectCode":"",
						"csrfToken":$rootScope.SessionId
						};			
						var url="adminsetup/getData";
						WebService.addData(	url, data)
								.then(function(response) {
									for(var i=0;i<response.length;i++){
										targetlevelAddFormarray.push(response[i].columnList);
									}
																		
									$scope.operatorsList = targetlevelAddFormarray;
								});
						

			}

			function loadUserData() {

				var data = {
						"wsCode":"",
						"columnList":["*"],
						"keyColumn":"ttl_id",
						"tableNameList":["tar_target_levels"],
						"filtersList":["ttl_id="+$scope.currentId],
						"joinsList":[],
						"moduleCode":"",
						"objectCode":"",
						"csrfToken":$rootScope.SessionId
				};
				var url = "adminsetup/getData";
				WebService.addData(url, data).then(function(response) {
					for (var i = 0; i < response.length; i++) {
						$scope.formData = response[0].columnList;
						$scope.targetLevelID=$scope.formData.ttl_id;
						
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
						"keyColumn":"ctg_id",
						"tableNameList":["tar_table_catalogue"],
						"filtersList":["ctg_ttl_id="+$scope.currentId],
						"joinsList":[],
						"moduleCode":"",
						"objectCode":"",
						"csrfToken":$rootScope.SessionId
				};
				var url = "adminsetup/getData";
				WebService.addData(url, datasource).then(function(response) {
					
					if(response.length!=0){
						if($scope.targetLevelID==response[0].columnList.ctg_ttl_id){
							jAlert("Target Level cannot be edited ");	
						}
					}else{
						
						var url = "adminsetup/saveDetails"
						var data =

						{
							"wsCode" : "",
							"action" : "U",
							"tableName" : "tar_target_levels",
							"keyColumn" : "ttl_id",
							"keyValue" : $scope.currentId,
							"columnValueMap" : [ $scope.formData ],
							"columnDataTypeMap" : {
								   "ttl_id":"N",
								   "ttl_name":"S",
								   "ttl_data_type":"S",
								   "createuser":"S",
								   "createdate":"D",
								   "updateuser":"S",
								   "updatedate":"D"
								   
								   
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
		
		
	
		