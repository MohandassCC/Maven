(function() {
    'use strict';
	angular.module('importApp')
	.factory('WebService', WebService)
	.service('dataService',dataService)
	.service('Folders',Folders)
	.service('WorkflowList',WorkflowList);
	WebService.$inject = ['$http', '$q', 'NgTableParams', '$filter'];
	Folders.$inject = ['$http', '$q', '$filter','$rootScope'];
	WorkflowList.$inject = ['$http', '$q', '$filter','$rootScope'];
	
	function WebService($http, $q, NgTableParams, $filter) {
		var service = {};
		service.GetData = GetData;
		service.drawTable = drawTable;
		service.addData = addData;
		service.deleteData = deleteData;
		service.uploadFileToUrl = uploadFileToUrl;
		var deferred = $q.defer();		
		var responseData;
		return service;
		var ConfigTableParams;

		function GetData(url) {
			var defer= $q.defer();		
			$http.get(url).then(function(response) {
                // The promise is resolved once the HTTP call is successful.
				defer.resolve(response.data);
            }            
			,function (reason){
				if(reason.data.failure!=null){
					defer.reject(reason.data);
				}
				else{
					reason.data.failure=reason.statusText
					defer.reject(reason.data);
				}
			});
	        // The promise is returned to the caller
	        return defer.promise;
		}

		function drawTable(data, count, searchitem) {
			return new NgTableParams({
				page: 1,
				count: count,
				filter: searchitem
			}, {
				total: data.length,
				getData: function ($defer, params) {
					var orderedData;
					if (params.filter().term) {
						orderedData = params.filter() ? $filter('filter')(data, params.filter().term) : data;
					} else {
						orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy(),true) : data;
					}
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
		}

		function addData(url, data) {

			var defer= $q.defer();		
			$http.post(url, data).then(function(response) {
                // The promise is resolved once the HTTP call is successful.
				defer.resolve(response.data);
            }            
			,function (reason){
				if(reason.data.failure!=null){
					defer.reject(reason.data);
				}
				else{
					reason.data.failure=reason.statusText
					defer.reject(reason.data);
				}
			});
	        // The promise is returned to the caller
	        return defer.promise;
		}

		function deleteData(url,id) {
			//$http.delete('/roles/'+roleid, {data: input});
			//return $http.delete(url,{data: input}).then(handleSuccess, handleError);
			
			return $http({
			    method: 'DELETE',
			    url: url,
			    data: {
			        id: id
			    },
			    headers: {
			        'Content-type': 'application/json;charset=utf-8'
			    }
			})
			.then(handleSuccess, handleError);
		}

		function handleSuccess(res) {
			return res.data;
		}

		function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
		
		/*File Upload*/
		function uploadFileToUrl(file,data, uploadUrl){
			 var deffered = $q.defer();
			 var fd = new FormData();
			 fd.append('file', file);
			 fd.append('data', data);
			 return $http.post(uploadUrl, fd, {
			    transformRequest: angular.identity,
			    headers: {'Content-Type': undefined}
			 })
			 .then(function(response){
				 responseData = response;
				 deffered.resolve(response);
				 return deffered.promise;
			 },
			 function(error){
				 deffered.reject(error.data);
				 return deffered.promise;
			 });

			}

			this.getResponse = function() {
			 return responseData;
			 }
	    
	}
	function dataService($location, $route, $rootScope) {
		$location.skipReload = function() {
			var lastRoute = $route.current;
			var un = $rootScope.$on('$locationChangeSuccess', function() {
				$route.current = lastRoute;
				un();
			});
			return $location;
		};
		return $location;
	}
//function dataService() {
//		  this.serviceData = "test";
//}
function Folders($http, $q, $filter,$rootScope){
	this.getfolders=function(id){
		var data={
				"wsCode":"",
				"columnList":["*"],
				"keyColumn":"",
				"tableNameList":["orc_folder"],
				"filtersList":["fld_id="+id],
				"joinsList":[],
				"moduleCode":"",
				"objectCode":"",
				"csrfToken":$rootScope.SessionTokenId
				}
		var url="orchestrator/getData"
		var defer= $q.defer();		
		$http.post(url, data).then(function(response) {
            // The promise is resolved once the HTTP call is successful.
			defer.resolve(response.data);
        }            
		,function (reason){
			if(reason.data.failure!=null){
				defer.reject(reason.data);
			}
			else{
				reason.data.failure=reason.statusText
				defer.reject(reason.data);
			}
		});
        // The promise is returned to the caller
        return defer.promise;
	}	
}
function WorkflowList($http, $q, $filter,$rootScope){
	//workflow/get/workflow/'+$scope.folderId+'/0
	var defer= $q.defer();		
	this.getWorkflowList=function(fid,wid){
		var data={
				"wsCode":"",
				"columnList":["*"],
				"keyColumn":"",
				"tableNameList":["wfl_diagrams_eng"],
				"filtersList":["fld_id="+fid,"wfd_id="+wid],
				"joinsList":[],
				"moduleCode":"",
				"objectCode":"",
				"csrfToken":$rootScope.SessionTokenId
				}
		var url="orchestrator/getData"
			var defer= $q.defer();		
		$http.post(url, data).then(function(response) {
            // The promise is resolved once the HTTP call is successful.
			defer.resolve(response.data);
        }            
		,function (reason){
			if(reason.data.failure!=null){
				defer.reject(reason.data);
			}
			else{
				reason.data.failure=reason.statusText
				defer.reject(reason.data);
			}
		});
        // The promise is returned to the caller
        return defer.promise;
	}
}

})();