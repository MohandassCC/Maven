(function() {
    'use strict';
	angular.module('importApp')
	.factory('uiPopupFactory',uiPopupFactory)
	.factory('uiAddPopupFactory',uiAddPopupFactory)
	.directive('ngConfirmDelete',ngConfirmDelete)
	.directive('onlyDigits',onlyDigits)
	.directive('onlySpecialCharacters',onlySpecialCharacters)
	.directive('onlyCharacters',onlyCharacters)
	.directive('fileModel',fileModel)
	.directive('historyBackward',historyBackward)
	.directive('folderView',folderView)
	.directive('checkList',checkList)
	.directive("toolTipDirective",ToolTipDirective)
	.directive("dirCustomLoader",dirCustomLoader)
	.filter('capitalize', capitalize)
	.filter('unique', unique)
	.filter('filterMultiple', filterMultiple);

fileModel.$inject =['$parse','$rootScope'];
//Generic pop  Box 	
function uiPopupFactory($http, $uibModal){
	var uipopup = {
			open: function (urlLink, controllerName, popupSize, backDrop,moduleName,viewType,rowId,title,fdata) {
				$uibModal.open({
					templateUrl: urlLink,
					controller: controllerName,
					size: popupSize, // lg, md, sm, xs
					backdrop: backDrop,
					controllerAs:'mdCtrl',
					resolve: {
				        item: function () {
				        	return {
				        			moduleName: moduleName,
				        			viewType: viewType,
				        			rowId:rowId,
				        			title:title,
				        			fdata:fdata
				        	    }
				        }
				      }
				})
			}
		}	
		return uipopup;
	}
function uiAddPopupFactory($http, $uibModal){
	var uipopup = {
			open: function (urlLink, controllerName,controllerAs, popupSize, backDrop,moduleName,viewType,rowId,title,fdata) {
				$uibModal.open({
					templateUrl: urlLink,
					controller: controllerName,
					size: popupSize, // lg, md, sm, xs
					backdrop: backDrop,
					controllerAs:controllerAs,
					resolve: {
				        item: function () {
				        	return {
				        			moduleName: moduleName,
				        			viewType: viewType,
				        			rowId:rowId,
				        			title:title,
				        			fdata:fdata
				        	    }
				        }
				      }
				})
			}
		}	
		return uipopup;
	}

//Generic Delete Confirm Box
ngConfirmDelete.$inject = ['$uibModal']	
function ngConfirmDelete($uibModal){
	var deleteConfirmController = function($scope, $uibModalInstance) {
		$scope.ok = function() {
	     	   $uibModalInstance.close();
	        };

	        $scope.cancel = function() {
	     	   $uibModalInstance.dismiss('cancel');
	        };
      };
      return {
          restrict: 'A',
          scope:{
            ngConfirmDelete:"&",
            item:"="
          },
          link: function(scope, element, attrs) {
            element.bind('click', function() {//confirm
              var message = attrs.ngConfirmMessage || "Are you sure ?";

              /*
              //This works
              if (message && confirm(message)) {
                scope.$apply(attrs.ngReallyClick);
              }
              //*/

              //*This doesn't works
              var modalHtml = '<div class="modal-body">' + message + '</div>';
              modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';
              var confirmDeleteTemplateUrl = CJApp.templatePath + '/common/deleteConfirm.html';
              var modalInstance = $uibModal.open({
                templateUrl:confirmDeleteTemplateUrl,
                controller: deleteConfirmController,
                size: "sm", // lg, md, sm, xs
				backdrop: 'static'
              });
              
             //var modalInstance = uiPopupFactory.open(confirmDeleteTemplateUrl, "ModalInstanceCtrl", "sm", 'static');
              
              modalInstance.result.then(function() {
                scope.ngConfirmDelete({item:scope.item}); //raise an error : $digest already in progress
              }, function() {
                //Modal dismissed
              });
              //*/
              return modalInstance;
            });

          }
        }
}
function onlyDigits() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
}
function onlySpecialCharacters() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^,:;|'"]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return digits;
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
}
function onlyCharacters() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^a-zA-Z_0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return digits;
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
}
function fileModel($parse,$rootScope){
	return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
            scope.$apply(function(){
              if (element[0].files.length > 1) {
                modelSetter(scope, element[0].files);
              }
              else {
                modelSetter(scope, element[0].files[0]);
                $rootScope.fileUploaded = true;
              }
            });
          });
        }
      };
}
function unique() {

	  return function (items, filterOn) {

	    if (filterOn === false) {
	      return items;
	    }

	    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
	      var hashCheck = {}, newItems = [];

	      var extractValueToCompare = function (item) {
	        if (angular.isObject(item) && angular.isString(filterOn)) {
	          return item[filterOn];
	        } else {
	          return item;
	        }
	      };

	      angular.forEach(items, function (item) {
	        var valueToCheck, isDuplicate = false;

	        for (var i = 0; i < newItems.length; i++) {
	          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
	            isDuplicate = true;
	            break;
	          }
	        }
	        if (!isDuplicate) {
	          newItems.push(item);
	        }

	      });
	      items = newItems;
	    }
	    return items;
	  }
}
function folderView(){
	return {
	    restrict: 'E',
	    templateUrl: 'common/folder.view.html'
	  };
}

function dirCustomLoader($http) {
    return {
        restrict: 'E',
        template: '<div class="loading-icon"></div>',
        link: function (scope, element, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (value) {
                if (value) 
                    element.removeClass('ng-hide');
                else 
                    element.addClass('ng-hide');
            });
        }
    };
}

function historyBackward($window) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.bind('click', function() {
                $window.history.back();
            });
        }
    };
}

function checkList() {
	  return {
	    scope: {
	      list: '=checkList',
	      value: '@'
	    },
	    link: function(scope, elem, attrs) {
	      var handler = function(setup) {
	        var checked = elem.prop('checked');
	        var index = scope.list.indexOf(scope.value);

	        if (checked && index == -1) {
	          if (setup) elem.prop('checked', false);
	          else scope.list.push(scope.value);
	        } else if (!checked && index != -1) {
	          if (setup) elem.prop('checked', true);
	          else scope.list.splice(index, 1);
	        }
	      };
	      
	      var setupHandler = handler.bind(null, true);
	      var changeHandler = handler.bind(null, false);
	            
	      elem.on('change', function() {
	        scope.$apply(changeHandler);
	      });
	      scope.$watch('list', setupHandler, true);
	    }
	  };
	}

function capitalize() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
}

ToolTipDirective.$inject = ['$compile'];
//needs to be made generic at some point
function ToolTipDirective($compile) {
    "use strict";

    return {
        link: function (scope, element) {
            var el = $(element),
                template = el.find('script.template').html(),
                title = '';

            if (template) {
                title = $compile(template)(scope);
            } else {
                title = el.attr('title');
            }

            el.tooltip({
                title: title,
                placement: "top"
            });
        }
    };
};
filterMultiple.$inject =['$filter'];
function filterMultiple($filter) {
    var comparator = function (actual, expected) {
        if (angular.isUndefined(actual)) {
          // No substring matching against `undefined`
          return false;
        }
        if ((actual === null) || (expected === null)) {
          // No substring matching against `null`; only match against `null`
          return actual === expected;
        }
        if ((angular.isObject(expected) && !angular.isArray(expected)) || (angular.isObject(actual) && !hasCustomToString(actual))) {
          // Should not compare primitives against objects, unless they have custom `toString` method
          return false;
        }

        actual = angular.lowercase('' + actual);
        if (angular.isArray(expected)) {
          var match = false;
          expected.forEach(function (e) {
            e = angular.lowercase('' + e);
            if (actual.indexOf(e) !== -1) {
              match = true;
            }
          });
          return match;
        } else {
          expected = angular.lowercase('' + expected);
          return actual.indexOf(expected) !== -1;
        }
      };
      return function (campaigns, filters) {
        return $filter('filter')(campaigns, filters, comparator);
      };
}



})();