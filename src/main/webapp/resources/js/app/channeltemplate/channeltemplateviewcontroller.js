(function () {
	'use strict';
	angular
		.module('importApp')
		.controller('channeltemplateviewcontroller', channeltemplateviewcontroller);
	channeltemplateviewcontroller.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$uibModal', 'uiPopupFactory','WebService','$filter','$location','uiAddPopupFactory','dataService'];
	
	
	
	function channeltemplateviewcontroller($scope, $http, $rootScope, $stateParams, $uibModal, uiPopupFactory,WebService,$filter,$location,uiAddPopupFactory,dataService){
		$scope.search = { term: '' };
		$scope.tableParams=[];	
		
		loadchanneltemplateslist();
		var templateUrl1 = CJApp.templatePath + '/channeltemplate/addchanneltemplate.html';
		var templateUrl2 = CJApp.templatePath + '/channeltemplate/editchanneltemplate.html';
		
		$rootScope.$on("loadChannelTemplateList", function(){
			loadchanneltemplateslist();
	     });
		
		function loadchanneltemplateslist() {
			var loadchanneltemplateslistarray=[]
			
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"",
					"tableNameList":["tar_channel_templates"],
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
									loadchanneltemplateslistarray.push(response[i].columnList);
								}		
								$scope.tableParams = WebService.drawTable(loadchanneltemplateslistarray, 10, $scope.search);
							});

		}
		$scope.add = function(){			
			uiAddPopupFactory.open(templateUrl1, "addchanneltemplatecontroller","add", "sm", 'static','Workflow','list',0,'Add Channel Template');
		}
		$scope.editRow = function(rId){
			uiAddPopupFactory.open(templateUrl2, "editchanneltemplatecontroller","edit", "sm", 'static','Workflow','list',rId,'Edit Channel Template');
		}
		
	$scope.deletePersonalizeColumn = function(personalizeId) {
			var data = {
					"wsCode":"",
					"columnList":["*"],
					"keyColumn":"tmt_tmpl_id",
					"tableNameList":["tar_communication"],
					"filtersList":["COM_OFF_ID = (SELECT  TOS_OFF_ID FROM tar_offer_messages where TOS_MSG_ID = (SELECT TMT_MSG_ID FROM tar_message_templates where TMT_TMPL_ID =" +  personalizeId+"))"],
					"joinsList":[],
					"moduleCode":"",
					"objectCode":"",
					"csrfToken":$rootScope.SessionId
			};
			var url = "adminsetup/getData";
			WebService.addData(url, data).then(function(response) {
				
				if(response.length!=0){
						jAlert("Channel template used in an offer, cannot be deleted");	
				}else if(response.length ==0){
					
					var url ='adminsetup/deleteRowId';
					var data =
					 {
						 "keyValue":personalizeId,	
						 "tableName":"tar_channel_templates",
						 "columnheader":"tmpl_id"
					 }
					WebService.addData(url, data).then(function(response) {				
							jAlert('Deleted Successfully')	
							$rootScope.$emit("loadChannelTemplateList");
					})['catch'](function(reason) {
			            $scope.error =reason;
			            jAlert(reason.failure || "Failed to delete filter column");
			        });
				}					
})
}}
})();
		
		