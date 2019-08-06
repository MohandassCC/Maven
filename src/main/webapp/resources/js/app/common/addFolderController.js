  angular
  	.module('importApp')
  	.controller('addFolderController', addFolderController)
  	.controller('editFolderController', editFolderController);
  addFolderController.$inject = ['$scope','$rootScope', '$location', '$uibModal', '$uibModalInstance','WebService','item'];
  editFolderController.$inject = ['$scope','$rootScope','$location', '$uibModal', '$uibModalInstance','WebService','item'];
  function addFolderController($scope,$rootScope, $location, $uibModal, $uibModalInstance,WebService,item) {
	  $scope.moduleName=item.moduleName;
	  $scope.viewType=item.viewType;
	  $scope.rowId=item.rowId;	  
	  $scope.title=item.title;	
	  $scope.folder={'folderType':item.moduleName,'id':item.rowId,'viewType':item.viewType};
	 
	  /* for add Folder  */
	  $scope.submit=function (){
		  
		  var url="target/saveDetails"
				var data=
			
						{  
						   "wsCode":"",
						   "action":"I",
						   "tableName":"orc_folder",
						   "keyColumn":"fld_id",
						   "keyValue":"",
						   "columnValueMap":[ $scope.formData ],
						   "columnDataTypeMap":{  
							   "fld_id":"N",
							   "fld_short_name":"S",
							   "fld_long_name":"S",
							   "fld_parent_fld_id":"N",
							   "fld_view_type":"S",
							   "fld_folder_type":"S",
							   "createuser":"S",
							   "createdate":"D",
							   "updateuser":"S",
							   "updatedate":"D",
							   "lastmodified":"T",
							   "fld_sub_type":"S"
						   },
						   "whereList":[],
						   "moduleCode":"",
						   "objectCode":"",
						   "csrfToken":"",
						   "childGetBean":[]
						}

				console.log(JSON.stringify(data));
				WebService.addData(url, data)
				.then(function(response) {
					//if(!response.success && response.success==undefined ){
						//alert(response.message)
						$uibModalInstance.close();
						$rootScope.$emit("loadFolders");
						
						jAlert("Folder added successfully");
//					}
//					else{
//						jAlert("Failed to add Folder");
//					}
					
					
				})['catch'](function(reason) {
		            // This is set in the event of an error.
		            $scope.error =reason;
		            jAlert(reason.failure);
		        });
		  

		  };

	  $scope.cancel = function () {
	  		$uibModalInstance.dismiss('cancel');
	  	
	  };
  }
  function editFolderController($scope,$rootScope, $location, $uibModal, $uibModalInstance,WebService,item) {
	  
	  $scope.formData=[];
	  $scope.moduleName=item.moduleName;
	  $scope.viewType=item.viewType;
	  $scope.rowId=item.rowId;	  
	  $scope.title=item.title;	
	  loadEditFolderData();
	  var url;
	  
	  function loadEditFolderData(){

		  var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["orc_folder"],
					"filtersList":["fld_id="+$scope.rowId],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
					};			
					var url="target/getData";
					WebService.addData(	url, data)
							.then(function(response) {
				
									$scope.formData=response[0].columnList;
	
							});
	  }
	  
	  $scope.cancel = function () {
	  		$uibModalInstance.dismiss('cancel');	
	  		return false;
	  };
	  
	  $scope.submit=function (){
		  var url="target/saveDetails"
				var data=
			
						{  
						   "wsCode":"",
						   "action":"U",
						   "tableName":"orc_folder",
						   "keyColumn":"fld_id",
						   "keyValue":$scope.rowId,
						   "columnValueMap":[ $scope.formData ],
						   "columnDataTypeMap":{  
							   "fld_id":"N",
							   "fld_short_name":"S",
							   "fld_long_name":"S",
							   "fld_parent_fld_id":"N",
							   "fld_view_type":"S",
							   "fld_folder_type":"S",
							   "createuser":"S",
							   "createdate":"D",
							   "updateuser":"S",
							   "updatedate":"D",
							   "lastmodified":"T",
							   "fld_sub_type":"S"
						   },
						   "whereList":[],
						   "moduleCode":"",
						   "objectCode":"",
						   "csrfToken":$rootScope.SessionId,
						   "childGetBean":[]
						}

				console.log(JSON.stringify(data));
				WebService.addData(url, data)
				.then(function(response) {
					if(!response.success && response.success==undefined ){
						//alert(response.message)
						$uibModalInstance.close();
						$rootScope.$emit("loadFolders");
						jAlert("Folder edited successfully");
					}
					else{
						jAlert("Failed to edit Folder");
					}
					
					
				});

	  }
  }