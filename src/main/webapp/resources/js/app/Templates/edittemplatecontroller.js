(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('edittemplatecontroller',edittemplatecontroller);
	edittemplatecontroller.$inject =  [ '$scope', '$rootScope','$filter', '$location', '$uibModal',
	                                   		'$uibModalInstance', 'WebService', 'item', 'uiPopupFactory' ,'dataService'];;

	
	function edittemplatecontroller($scope, $rootScope,$filter, $location, $uibModal,
			$uibModalInstance, WebService, item, uiPopupFactory,dataService){
		$scope.search = { term: '' };
		$scope.title = "Add Templates";
		$scope.tem_attr_List = [];
		$scope.operatorsList = [];		
		$scope.tableParams = [];	
		$scope.selectionData = [];
		$scope.formData = {};
		$scope.rowId = item.rowId;
		
		loadCustomattr();
		loadObjecttype();
		loadUserData();
		loadSavedCustomAttributes();
		
		/*Close popup*/
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
		function loadUserData(){
			var data = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "TAR_TEMPLATES" ],
				"filtersList" : [ "TMP_ID =" + $scope.rowId ],
				"joinsList" : [],
				"moduleCode" : "",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId
			};
			var url = "adminsetup/getData";
			WebService.addData(url, data).then(function(response) {
				for (var i = 0; i < response.length; i++) {
					$scope.formData = response[0].columnList;
				}

			})['catch'](function(reason) {
				// This is set in the event of an error.
				$scope.error = reason;
				jAlert(reason.error || 'Something went wrong on loading data');
			});
			
		}
		
		function loadSavedCustomAttributes(){
			$scope.selectednewcolumngroupdatas = {
			        "atr_id" : "",
				    "atr_name" : " ",
				    "atr_long_name" : " ",
				    "atr_object_type" :" ",
				    "atr_display_group" : "",
				    "atr_sort_order" : "",
				    "atr_data_type" : "",
				    "atr_max_length" : "",
				    "atr_min_value" : "",
				    "atr_max_value" : "",
				    "atr_format" : "",
				    "atr_lookup_code" : "",
				    "atr_create_user" : "",
				    "atr_create_date" : "",
				    "atr_update_user" : "",
				    "atr_update_date" : "",
				    "atr_last_modified" : "",
				    "atr_parameterized_value" : ""
				    	
					};
			$scope.selectedaddcolumngroupdata = [{
		        "atr_id" : "",
			    "atr_name" : " ",
			    "atr_long_name" : " ",
			    "atr_object_type" :" ",
			    "atr_display_group" : "",
			    "atr_sort_order" : "",
			    "atr_data_type" : "",
			    "atr_max_length" : "",
			    "atr_min_value" : "",
			    "atr_max_value" : "",
			    "atr_format" : "",
			    "atr_lookup_code" : "",
			    "atr_create_user" : "",
			    "atr_create_date" : "",
			    "atr_update_user" : "",
			    "atr_update_date" : "",
			    "atr_last_modified" : "",
			    "atr_parameterized_value" : ""
			    	
				}]
			var data1 = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "TAR_TEMPLATE_ATTRIBUTES" ],
				"filtersList" : [ "TTA_TMP_ID =" + $scope.rowId ],
				"joinsList" : [],
				"moduleCode" : "",
				"objectCode" : "",
				"csrfToken" : $rootScope.SessionTokenId
			};
			var url1 = "adminsetup/getData";
			WebService.addData(url1, data1).then(function(response) {
				for (var i = 0; i < response.length; i++) {
					
					var data = {
							"wsCode":"",
							"columnList":["*"],
							"keyColumn":"",
							"tableNameList":["tar_custom_attributes"],
							"filtersList":["atr_id ="+response[i].columnList.tta_atr_id ],
							"joinsList":[],
							"moduleCode":"",
							"objectCode":"",
							"csrfToken":$rootScope.SessionId
							};			
							var url="adminsetup/getData";
							WebService.addData(	url, data)
									.then(function(response) {
										for(var i=0;i<response.length;i++){
//											$scope.selectednewcolumngroupdatas.atr_name = response[i].columnList.atr_name; 
//											$scope.selectednewcolumngroupdatas.atr_id = response[i].columnList.atr_id;
//											alert($scope.selectednewcolumngroupdatas.atr_id);
//											alert($scope.selectednewcolumngroupdatas.atr_name);
//											$scope.selectedaddcolumngroupdata.push($scope.selectednewcolumngroupdatas);
//											alert($scope.selectedaddcolumngroupdata);
										}
										
										
									});
				}

				
				
			})['catch'](function(reason) {
				// This is set in the event of an error.
				$scope.error = reason;
				jAlert(reason.error || 'Something went wrong on loading data');
			});
		}
		
		function loadObjecttype(){
			
          var templatesAddFormarray=[]
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["tar_templates"],
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
									templatesAddFormarray.push(response[i].columnList);
								}
								
								//$scope.tableParams = WebService.drawTable(personalizationAddFormarray, 10, $scope.search);
								
								$scope.operatorsLists = templatesAddFormarray;
							});
		}
	
		function loadCustomattr(){
			var templatesAddFormarray=[]
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["tar_custom_attributes"],
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
									templatesAddFormarray.push(response[i].columnList);
								}
								//$scope.tableParams = WebService.drawTable(personalizationAddFormarray, 10, $scope.search);
								$scope.operatorsList = templatesAddFormarray;
							});
		}
									
	
		loadobjtype();
	function loadobjtype(){
							
		$scope.selectpushcolumngroup = [{
	        "atr_id" : "",
		    "atr_name" : " ",
		    "atr_long_name" : " ",
		    "atr_object_type" :" ",
		    "atr_display_group" : "",
		    "atr_sort_order" : "",
		    "atr_data_type" : "",
		    "atr_max_length" : "",
		    "atr_min_value" : "",
		    "atr_max_value" : "",
		    "atr_format" : "",
		    "atr_lookup_code" : "",
		    "atr_create_user" : "",
		    "atr_create_date" : "",
		    "atr_update_user" : "",
		    "atr_update_date" : "",
		    "atr_last_modified" : "",
		    "atr_parameterized_value" : ""
		    	
			}]
		
		
		loadmodules();
		function loadmodules(){
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["tar_custom_attributes"],
					"filtersList":[],//["atr_object_type='C'"],
					"joinsList":[],
					"moduleCode":"",
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
		
	}
		
		$scope.displaysecondselectedgroupdata = $scope.selectedaddcolumngroupdata;
		$scope.selectedaddcolumngroupdata = [{
			"atr_id" : "",
		    "atr_name" : "",
		    "atr_long_name" : "",
		    "atr_object_type" : "",
		    "atr_display_group" : "",
		    "atr_sort_order" : "",
		    "atr_data_type" : "",
		    "atr_max_length" : "",
		    "atr_min_value" : "",
		    "atr_max_value" : "",
		    "atr_format" : "",
		    "atr_lookup_code" : "",
		    "atr_create_user" : "",
		    "atr_create_date" : "",
		    "atr_update_user" : "",
		    "atr_update_date" : "",
		    "atr_last_modified" : "",
		    "atr_parameterized_value" : ""
			}];
		
		$scope.moveItem = function (items, from, to){
			//$scope.tem_attr_List.push(from[items]);
			items.forEach(function(item){
				var idx = null; 
				var item1 =				        
				{     
						"atr_id" : "",
					    "atr_name" : " ",
					    "atr_long_name" : " ",
					    "atr_object_type" : "",
					    "atr_display_group" : "",
					    "atr_sort_order" : "",
					    "atr_data_type" : "",
					    "atr_max_length" : "",
					    "atr_min_value" : "",
					    "atr_max_value" : "",
					    "atr_format" : "",
					    "atr_lookup_code" : "",
					    "atr_create_user" : "",
					    "atr_create_date" : "",
					    "atr_update_user" : "",
					    "atr_update_date" : "",
					    "atr_last_modified" : "",
					    "atr_parameterized_value" : ""
					}
			
				for(var i=0;i < from.length;i++)
				{
					if(from[i].atr_id == item)
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
		
		
		
		$scope.submit = function(){
			$scope.addAttributesArray= [];
	    	var selectedModules={}
	    	$scope.ObjectArr = [];		
	    	
			//Saving to TAR_TEMPLATES table.	
			
			var url="adminsetup/saveDetails"		
				var data=
						{  
						   "wsCode":"",
						   "action":"U",
						   "tableName":"tar_templates",
						   "keyColumn":"tmp_id",
						   "keyValue":$scope.rowId,
						   "columnValueMap":[$scope.formData],
						   "columnDataTypeMap":{  
							    "tmp_id" :"N",
								"tmp_short_name" :"S",
								"tmp_long_name":"S",
								"tmp_fld_id":"N",
								"tmp_category_code":"S",
								"tmp_object_type":"S",
								"tmp_sort_order":"N",
								"tmp_status":"S",
								"tmp_status_date":"D",
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
									for(var i=1;i<$scope.selectedaddcolumngroupdata.length;i++)
									{
									if($scope.selectedaddcolumngroupdata[i].atr_id !=  ""){						
									var	selectedModule = {
												"tta_tmp_id" :response.keyValue,
												"tta_atr_id" :$scope.selectedaddcolumngroupdata[i].atr_id,
												"tta_sort_order":"",
												"createuser":"",
												"createdate":"",
												"updateuser":"",
												"updatedate":"",
												"lastmodified":""				
										}	
									$scope.ObjectArr.push(selectedModule);
									}
									}
									var url1 ="adminsetup/saveDetails"
								var data1 =	 {  
										   "wsCode":"",
										   "action":"U",
										   "tableName":"tar_template_attributes",
										   "keyColumn":"tta_tmp_id",
										   "keyValue":$scope.rowId,
										   "columnValueMap":$scope.ObjectArr,
										   "columnDataTypeMap":{ 
											    "tta_id" : "N",
											    "tta_tmp_id" :"N",
												"tta_atr_id" :"N",
												"tta_sort_order":"N",
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
									WebService.addData(url1, data1)
									.then(function(response) {
										console.log(response);
									})['catch'](function(reason) {
							            // This is set in the event of an error.
							            $scope.error =reason;
							            jAlert(reason.error);
							        });
									$rootScope.$emit("loadTemplateList");
									$uibModalInstance.close();
									jAlert("Templates Edited successfully");
									
					})['catch'](function(reason) {
			            // This is set in the event of an error.
			            $scope.error =reason;
			            jAlert(reason.error);
			        });

				
				
		}
	}
	
})();


