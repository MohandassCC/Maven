angular.module('importApp').controller('editchanneltemplatecontroller', editchanneltemplatecontroller).controller('editchanneltemplatecontroller',editchanneltemplatecontroller);
						 							
editchanneltemplatecontroller.$inject = ['$scope', '$rootScope', '$filter',
                             			'$location', '$uibModal', '$uibModalInstance', 'WebService',
                            			'item', 'uiPopupFactory', 'dataService'];

	function editchanneltemplatecontroller($scope, $rootScope, $filter, $location,
			$uibModal, $uibModalInstance, WebService, item, uiPopupFactory,
			dataService){
		$scope.rowId = item.rowId;
		$scope.title = item.title;
		$scope.formData = {}
		loadUserData();
		
		/*Close popup*/
		$scope.cancel = function() {
			jConfirm('Are you sure you want to close the popup?', 'Confirm', function(confirmed){
			  if(confirmed){
				  $uibModalInstance.dismiss('cancel');
			  }
			});		
		};
		
		function loadUserData(){
			var data = {
				"wsCode" : "",
				"columnList" : [ "*" ],
				"keyColumn" : "",
				"tableNameList" : [ "TAR_CHANNEL_TEMPLATES" ],
				"filtersList" : [ "TMPL_ID =" + $scope.rowId ],
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
	  	
	  	$scope.submit = function() {
	  		
	  		var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"tmt_tmpl_id",
					"tableNameList":["tar_communication"],
					"filtersList":["COM_OFF_ID = (SELECT  TOS_OFF_ID FROM tar_offer_messages where TOS_MSG_ID = (SELECT TMT_MSG_ID FROM tar_message_templates where TMT_TMPL_ID =" +  $scope.rowId+"))"],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
			};
	  		
	  		var url = "adminsetup/getData";
			WebService.addData(url, data).then(function(response) {
				
				if(response.length!=0){
						jAlert("Channel template used in an offer, cannot be edited");	
				}else if(response.length ==0){
			var url="adminsetup/saveDetails"
				var data=
			
						{  
						   "wsCode":"",
						   "action":"U",
						   "tableName":"tar_channel_templates",
						   "keyColumn":"tmpl_id",
						   "keyValue":$scope.rowId,
						   "columnValueMap":[ $scope.formData ],
						   "columnDataTypeMap":{  
							   "tmpl_id":"N",
							   "tmpl_name":"S",
							   "tmpl_description":"S",
							   "tmpl_content":"S",
							   "createuser":"S",
							   "createdate":"D",
							   "updateuser":"S",
							   "updatedate":"D",
							   "lastmodified":"T",
							   "tmpl_prf_field_list":"S",
							   "tmpl_tcdc_rulename":"S",
							   "tmpl_tcdc_id":"N"
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
									
									jAlert("Channel template Edited successfully")
									$rootScope.$emit("loadChannelTemplateList");
					})['catch'](function(reason) {
						$uibModalInstance.close();	
			            // This is set in the event of an error.
			            $scope.error =reason;
			            jAlert(reason.error);
			        });
				}
			})
	  	}//end of submit
	  	
	  	$scope.closepopup = function () {
	  		$scope.$dismiss('close');
	  	}
		
	}
	  	

			
		
	
		