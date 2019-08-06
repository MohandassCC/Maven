<html ng-app="importApp">
<head>
<meta charset="utf-8">
<title> SetUp</title>
<link rel="stylesheet"
	href="resources/css/theme/vendor/fontawesome/css/font-awesome.css" />
<link rel="stylesheet"
	href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
	rel="stylesheet">
<link rel="stylesheet"
	href="resources/css/bootstrap/bootstrap-3.3.7/bootstrap.min.css">
<link rel="stylesheet"
	href="https://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.css">
<link href="resources/css/style.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet"
	href="resources/css/theme/vendor/metisMenu/dist/metisMenu.css" />
<link rel="stylesheet"
	href="resources/css/theme/vendor/animate.css/animate.css" />
<link rel="stylesheet"
	href="resources/css/angulartable/ng-table.min.css">
<link rel="stylesheet"
	href="resources/css/angular-bootstrap-lightbox/angular-bootstrap-lightbox.min.css">
<link rel="stylesheet" href="resources/css/animate.css">
<link rel="stylesheet" href="resources/css/importStyle.css">
<link rel="stylesheet" href="resources/css/workflow/workflowStyle.css">
<link rel="stylesheet"
	href="resources/css/angular-timepicker/md-time-picker.css">
<link rel="stylesheet"
	href="resources/css/datepicker/angular-datepicker.css">
<link rel="stylesheet"
	href="resources/js/lib/jquery.contextMenu/jquery.contextMenu.css">
<link rel="stylesheet"
	href="resources/js/lib/jquery-alerts-1.1/jquery-alerts.css">
	
	<!-- jstree -->
		<link rel="stylesheet"  href="resources/css/jstree/style.css" >
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<div class="col-lg-12 headbreadcrumb">				
					<ol class="hbreadcrumb" id="navigation-tabs-design"
						ncy-breadcrumb>
					</ol>
				<div class="breadcrumb-back-btn hbreadcrumb pull-right" style="display:none">
					<button history-backward class="btn "><i class="fa fa-undo" aria-hidden="true"></i></button>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-12">
				<ui-view></ui-view>
			</div>
		</div>
		

       
		<!-- Script Loading Area -->
		<script src="resources/js/lib/jquery-3.1.1/jquery-3.1.1.min.js"></script>
		<script
		src="resources/js/lib/jquery-3.1.1/jquery-ui.min.js"></script>
		<script
		src="resources/js/lib/jquery.contextMenu/jquery.contextMenu.js"></script>
		<script
		src="resources/js/lib/jquery-alerts-1.1/jquery-alerts.js"></script>
		<script src="resources/js/lib/angular-1.6.0/angular.min.js"></script>
		<script src="resources/js/lib/angular-1.6.0/angular-route.min.js"></script>
		<script src="resources/js/lib/angular-1.6.0/angular-resource.js"
			type="text/javascript"></script>
		<script src="resources/js/lib/angular-1.6.0/angular-ui-router.js"
			type="text/javascript">
			
		</script>
		<!-- jstree -->
		<script src="resources/js/lib/jsTree/angularTree.js"></script>
		<script
			src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-messages.min.js"></script>
		<script
			src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.min.js"></script>
		<script
			src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-aria.min.js"></script>
		<script
			src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js"></script>
		<script
			src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.0/angular-cookies.min.js"
			type="text/javascript"></script>
		<script
			src="resources/js/lib/angular-bootstrap-lightbox/angular-bootstrap-lightbox.min.js"></script>
		<script type="text/javascript"
			src="resources/js/lib/angular-ui-bootstrap/1.3.3/ui-bootstrap.min.js"></script>
		<script type="text/javascript"
			src="resources/js/lib/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.min.js"></script>
		<script
			src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.6.0/angular-sanitize.js"
			type="text/javascript"></script>
		<script src="resources/js/lib/angulartable/ng-table.min.js"></script>
		<script src="resources/js/lib/breadcrumb/angular-breadcrumb.min.js"
			type="text/javascript"></script>
		<script src="resources/js/lib/angular-chart/Chart.js"></script>
		<script src="resources/js/lib/angular-chart/angular-chart.js"></script>
		<script src="resources/js/lib/datepicker/angular-datepicker.js"></script>
		<script src="resources/js/lib/angular-timepicker/md-time-picker.js"></script>
		<script src="resources/js/lib/angular-drag-drop/angular-drag-drop.min.js"></script>
		<script src="resources/js/lib/jsPlumb/jsplumb.min.js"></script>
		<script src="resources/js/app/app.js"></script>
		<script src="resources/js/app/services/web.service.js"></script>
		<script src="resources/js/app/services/popupFactory.js"></script>
		<script src="resources/js/app/services/workflowService.js"></script>
		<script src="resources/js/app/home/homeController.js"></script>
		<script src="resources/js/app/common/addFolderController.js"></script>
		
	
		
	<script src="resources/js/app/user/userListController.js"></script>
	<script src="resources/js/app/group/groupListController.js"></script>
	<script src="resources/js/app/usergroups/userGroupController.js"></script>
	<script src="resources/js/app/user/adduserController.js"></script>	
	<script src="resources/js/app/group/addGroupController.js"></script>
	<script src="resources/js/app/usergroups/addUserGroupController.js"></script>
	<script src="resources/js/app/personalizationfield/addpersonalizationController.js"></script>
	<script src="resources/js/app/personalizationfield/personalizationframeController.js"></script>
	<script src="resources/js/app/channeltemplate/channeltemplateviewcontroller.js"></script>
	<script src="resources/js/app/channeltemplate/addchanneltemplatecontroller.js"></script>
	<script src="resources/js/app/channeltemplate/editchanneltemplatecontroller.js"></script>
	<script src="resources/js/app/targetlevel/targetlevelviewcontroller.js"></script>
	<script src="resources/js/app/targetlevel/addtargetlevelcontroller.js"></script>
	<script src="resources/js/app/Templates/templatesviewcontroller.js"></script>

	<script src="resources/js/app/Templates/addtemplatecontroller.js"></script>
    <script src="resources/js/app/Templates/edittemplatecontroller.js"></script>
	<script src="resources/js/app/group/viewGroupPermissionController.js"></script>
	<script src="resources/js/app/group/addGroupPermissionController.js"></script>

	<script src="resources/js/app/group/viewGroupPermissionController.js"></script>
	<script src="resources/js/app/group/addGroupPermissionController.js"></script>	
	<script src="resources/js/app/setup/setupController.js"></script>
		<script src="resources/js/app/common/frameController.js"></script>
		<script src="resources/js/app/customattribute/customAttributeController.js"></script>
	<script src="resources/js/app/customattribute/editCustomAttributeController.js"></script>
	<script src="resources/js/app/customattribute/addNewCustomAttributeController.js"></script>
	
	
		
	
		
		
		
</body>
</html>
