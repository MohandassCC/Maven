angular.module('importApp').controller('addchanneltemplatecontroller', addchanneltemplatecontroller).controller('addchanneltemplatecontroller',addchanneltemplatecontroller);
						 
							
addchanneltemplatecontroller.$inject = ['$scope','$http','$rootScope','$stateParams','$uibModal','$uibModalInstance','uiPopupFactory','WebService','$filter','$location'];


	function addchanneltemplatecontroller($scope, $http, $rootScope, $stateParams, $uibModal,$uibModalInstance,uiPopupFactory,
			WebService,$filter,$location){
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		$scope.selectionData=[];
		$scope.formData={};
		$scope.title="Add Channel Template";
		$scope.title1="Upload any one of the  following file formats *.html,*.html with maximum file  size of 2MB"
	    $scope.editTemplate = false;
		$scope.name ="";
		$scope.personOption = "";
		var mapedValues = new Map();
		$scope.perOptions = [];
		$scope.mappedVales = [];
		/*Close popup*/
		$scope.cancel = function() {
			jConfirm('Are you sure you want to close the popup?', 'Confirm', function(confirmed){
			  if(confirmed){
				  $uibModalInstance.dismiss('cancel');
			  }
			});		
		};
		
	  	
	  	$scope.submit = function() {
			var url="adminsetup/saveDetails"
				var data=
			
						{  
						   "wsCode":"",
						   "action":"I",
						   "tableName":"tar_channel_templates",
						   "keyColumn":"tmpl_id",
						   "keyValue":"",
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
							   "tmpl_last_modified":"T",
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
									jAlert("Channel Template saved successfully")
									
								
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
	  	
	  	$scope.view = function() {
	  	    var f = document.getElementById('file').files[0],
	  	        r = new FileReader();

	  	    r.onloadend = function(e) {
	  	      var data = e.target.result;
	  	      //send your binary data via $http or $resource or do anything else with it
	  	    }

	  	    r.readAsBinaryString(f);
	  	}
	  	
	  	
		$scope.loadFile = function() {
			
				var x = document.getElementById("channelFileUpload");
					var file = x.files;
					var extension = file[0].name.substr((file[0].name.lastIndexOf('.') + 1));
					
					if(!extension.includes('html') || !extension.includes('htm')){
						alert("Please upload only .html or .htm file");
						x.value = "";
						return;
					}
					if(file[0].size > 2097152){
						alert("Please upload only max size of 2 MB file");
						x.value = "";
						return;
					}
					$scope.editTemplate = true;
					}
		$scope.getkeys = function (event) {
			$scope.matchValues = [];
			var content = angular.element('#editTempl').val();
			$scope.matchValues = content.match(/[^{{}}]+(?=}})/g);
			
			}
		
		$scope.personalizeContent =  function (){
			if($scope.mappedValues == null || $scope.mappedValues == "" || $scope.mappedValues == undefined)
				jAlert("Choose Personalize options.");
			var personalContent = angular.element('#editTempl').val();
			$scope.personalizedContent = personalContent.replace(/(\{{)/g,'\[[').replace(/(\}})/g,'\]]');
			
			
			 angular.forEach($scope.matchValues, function (valueMv, keyMv) { 
				 angular.forEach($scope.mappedValues, function (valueMp, keyMp) { 
		                if(keyMp == keyMv){
		                	$scope.personalizedContent = $scope.personalizedContent.replace(valueMv,valueMp);
		               }
		            }); 
	            });  
			 document.getElementById("editTempl").value = $scope.personalizedContent;
		}
		$scope.setMapValues = function(data,index){
			
			mapedValues.set(index,data);
			$scope.mappedValues = Array.from(mapedValues.values());
		}
		$scope.savePersonalizedContent = function(){
			if($scope.personalizedContent == null || $scope.personalizedContent == "")
				jAlert("First Personalise, then submit.");

			var url="adminsetup/saveDetails"
				var data=
			
						{  
						   "wsCode":"",
						   "action":"I",
						   "tableName":"tar_channel_templates",
						   "keyColumn":"tmpl_id",
						   "keyValue":"",
						   "columnValueMap":[ $scope.formData ],
						   "columnDataTypeMap":{  
							   "tmpl_id":"N",
							   "tmpl_name":"S",
							   "tmpl_description":"S",
							   "tmpl_content":"C",
							   "createuser":"S",
							   "createdate":"D",
							   "updateuser":"S",
							   "updatedate":"D",
							   "tmpl_last_modified":"T",
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
									jAlert("Channel Template saved")
									$rootScope.$emit("loadChannelTemplateList");
								
					})['catch'](function(reason) {
						$uibModalInstance.close();	
			            // This is set in the event of an error.
			            $scope.error =reason;
			            jAlert(reason.error);
			        });
	  	
		}
	}
	  	

			
		
	
		