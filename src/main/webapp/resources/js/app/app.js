var CJApp = angular
.module("importApp", ["ng","ui.bootstrap", "ngRoute", "ui.router.state", "ncy-angular-breadcrumb", "ngTable","720kb.datepicker","ngMaterial","md.time.picker","ngDragDrop","angularTreeview",'chart.js'])
	.constant('Count', 10)
	.config(function ($breadcrumbProvider, $routeProvider) {
		$breadcrumbProvider.setOptions({
			prefixStateName: '/',
			template: 'bootstrap2'
		});
	})
	.config(function ($stateProvider, $urlRouterProvider, $routeProvider, $qProvider,$mdThemingProvider,$sceProvider,ChartJsProvider) {
		$qProvider.errorOnUnhandledRejections(false);
		//console.log($rootScope)
		$stateProvider
			.state('/', {
				url: '/',
				templateUrl: CJApp.templatePath + '/home/home.view.html',
				controller: 'homeController',
				ncyBreadcrumb: {
					label: 'Home'
				}
			})
			
			.state('/setupview', {
				url: '/setupview',
				templateUrl: CJApp.templatePath + '/setup/setup.html',
				controller: 'setupController',
				ncyBreadcrumb: {
					label: '',
					parent: ''
				}
			})
			
			
			.state('/offer', {
				url: '/offer',
				templateUrl: CJApp.templatePath + '/target/folder.view.html',
				controller: 'targetFolderController',
				ncyBreadcrumb: {
					label: 'Offer',
					parent: '/'
				}
			})
			
			
			
			.state('/offerList/:folderid', {
				url: '/offerList/:folderid',
				templateUrl: CJApp.templatePath + '/target/table.view.html',
				controller: 'offerListController',
				ncyBreadcrumb: {
					label: '{{folder.fld_short_name}}',
					parent: '/offer'
				}
			})
			/*  admin Set Up Code*/
			
			.state('/admuser', {
				url: '/admuser',
				//templateUrl: mainPath + '/common/frame.html',
				templateUrl:  CJApp.templatePath + '/user/userListview.html',
				controller: 'userListController',
			
				ncyBreadcrumb: {
					label: 'User',
					parent: '/'
				}
			})
			
			.state('/admgroup', {
				url: '/admgroup',
				templateUrl:  CJApp.templatePath + '/group/grouplist.html',
				controller: 'groupListController',				
				ncyBreadcrumb: {
					label: 'Group',
					parent: '/'
				}
			})
			
			.state('/admusergroup', {
				url: '/admusergroup',
				templateUrl:  CJApp.templatePath + '/usergroups/usergroupsview.html',
				controller: 'userGroupController',				
				ncyBreadcrumb: {
					label: 'User Groups',
					parent: '/'
				}
			})
			

			.state('/personalizationfields', {
				url: '/personalizationfields',
				templateUrl: CJApp.templatePath + '/personalizationfield/personalizedtableview.html',
				controller: 'personalizationframeController',
				
				ncyBreadcrumb: {
					label: 'Personalization',
					parent: '/'
				}
			})
			
			.state('/channeltemplate', {
				url: '/channeltemplate',
				templateUrl: CJApp.templatePath + '/channeltemplate/channeltemplateview.html',
				controller: 'channeltemplateviewcontroller',				
				ncyBreadcrumb: {
					label: 'channeltemplate',
					parent: '/'
				}
			})
			
			.state('/targetlevel', {
				url: '/targetlevel',
				templateUrl: CJApp.templatePath + '/targetlevel/targetlevelview.html',
				controller: 'targetlevelviewcontroller',				
				ncyBreadcrumb: {
					label: 'targetlevel',
					parent: '/'
				}
			})
			.state('/customAttribute', {
				url: '/customAttribute',
				templateUrl: CJApp.templatePath + '/customattribute/CustomAttribute.view.html',
				controller: 'customAttributeController',
				ncyBreadcrumb: {
					label: 'CustomAttribute',
					parent: '/'
				}
			})
			
			.state('/templates', {
				url: '/templates',
				templateUrl: CJApp.templatePath + '/Templates/templatesview.html',
				controller: 'templatesviewcontroller',				
				ncyBreadcrumb: {
					label: 'templates',
					parent: '/'
				}
			})

			.state('/grouppermission/:groupCode', {
				url: '/grouppermission/:groupCode',
				templateUrl:  CJApp.templatePath + '/group/viewGroupPermission.html',
				controller: 'viewGroupPermissionController',				
				ncyBreadcrumb: {
					label: 'Group Permission',
					parent: '/'
				}
			})
			
			
			.state('/SourceConfiguration', {
				url: '/SourceConfiguration',
				templateUrl: CJApp.templatePath + '/common/frame.html',
				controller: 'frameController',
				resolve:{
					task : function(){
			            return "http://192.168.0.36:8084/orchestrator/#!/SourceConfiguration"
			        }
			    },
				ncyBreadcrumb: {
					label: 'Configuration',
					parent: '/'
				}
			})
			
			.state('/eventConfiguration', {
				url: '/eventConfiguration',
				templateUrl: CJApp.templatePath + '/common/frame.html',
				controller: 'frameController',
				resolve:{
					task : function(){

			            return "http://192.168.0.36:8084/orchestrator/#!/eventconfiguration"

			        }
			    },
				ncyBreadcrumb: {
					label: 'Configuration',
					parent: '/'
				}
			})
			
			
			.state('/workflowList/:diagramType/:folderid', {
				url: '/workflowList/:diagramType/:folderid',
				templateUrl: CJApp.templatePath + '/workflow/table.view.html',
				controller: 'offerListController',
				ncyBreadcrumb: {
					label: '{{folder.fld_short_name}}',
					parent: '/workflow/:diagramType/:sessionid/:username'
				}
			})
			.state('/workflowList/:diagramType/:folderid/workflowview/:id', {
				url: '/workflowList/:diagramType/:folderid/workflowview/:id',
				templateUrl: CJApp.templatePath + '/workflow/workflow.view.html',
				controller: 'workflowController',
				ncyBreadcrumb: {
					label: '{{workflowDetail.wfd_short_name}}',
					parent: '/workflowList/:diagramType/:folderid'
				}

			
			})

		$urlRouterProvider.otherwise('/');
		 'use strict';
		 //pick time
	      $mdThemingProvider.theme('default')
	        .primaryPalette('yellow');
	      $sceProvider.enabled(false);
	})
	.run(function($rootScope,uiPopupFactory) {
		var templateUrl = CJApp.templatePath + '/common/addFolder.html';
	    $rootScope.addFolder = function (moduleType,viewType,rowId) {
	    	uiPopupFactory.open(templateUrl, "addFolderController", "md", 'static',moduleType,viewType,rowId,"Add Folder");	
	    	//alert('chk');
	    }
	    $rootScope.editFolder = function (moduleType,viewType,rowId) {
	    	uiPopupFactory.open(templateUrl, "editFolderController", "md", 'static',moduleType,viewType,rowId,"Edit Folder");	
	    }
	});
CJApp.templatePath = 'resources/js/app';
