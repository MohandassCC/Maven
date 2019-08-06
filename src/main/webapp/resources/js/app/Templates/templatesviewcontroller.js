(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('templatesviewcontroller', templatesviewcontroller);
	templatesviewcontroller.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService','$filter','$location','uiAddPopupFactory','dataService'];
	
	
	
	function templatesviewcontroller($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService,$filter,$location,uiAddPopupFactory,dataService){
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		
		loadtemplatesviewlist();
 
		var addTemplateUrl = CJApp.templatePath + '/Templates/addtemplate.html';
		var editTemplateUrl = CJApp.templatePath + '/Templates/edittemplate.html';
		
		$rootScope.$on("loadTemplateList", function(){
			loadtemplatesviewlist();
	     });
		
		function loadtemplatesviewlist() {
			var loadtemplatesviewlistarray=[]
			
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
									loadtemplatesviewlistarray.push(response[i].columnList);
								}		
								$scope.tableParams = WebService.drawTable(loadtemplatesviewlistarray, 10, $scope.search);
							});

		}
		$scope.addTemplate=function(){			
			uiAddPopupFactory.open(addTemplateUrl, "addtemplatecontroller","add", "sm", 'static','Workflow','list',0,'Add Templates');
		}
		$scope.editTemplate=function(rId){
			
			uiAddPopupFactory.open(editTemplateUrl, "edittemplatecontroller","edit", "sm", 'static','Workflow','list',rId,'Edit Templates');
		}
		
		
	
	$scope.deleteTemplate = function(tmp_id) {
						
		/*		
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"pfm_id",
					"tableNameList":["tar_templates"],
					"filtersList":["tmp_id="+tmp_id],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
			};
			var url = "adminsetup/getData";
			WebService.addData(url, data).then(function(response) {
				
				if(response.length!=0){
					if(personalizeId==response[0].columnList.tmp_id){
						
						
						jAlert("Template cannot be deleted");	
					}
				}else{
			*/
					var url='adminsetup/deleteRowId';
					var data=
					 {
						 "keyValue":tmp_id,	
						 "tableName":"tar_templates",
						 "columnheader":"tmp_id"
					 }
					WebService.addData(url, data).then(function(response) {				
							jAlert('Template deleted')				
					})['catch'](function(reason) {
			            $scope.error =reason;
			            jAlert(reason.failure || "Failed to delete filter column");
			        });
				}		
	//}
//})();
	
}//}
})();
		
		