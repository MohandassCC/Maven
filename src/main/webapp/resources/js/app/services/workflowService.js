angular.module('importApp').factory('WorkflowService', WorkflowService);
WorkflowService.$inject = [ '$http', '$q', '$rootScope', 'WebService' ];

function WorkflowService($http, $q, $rootScope, WebService) {
	var workflowservice = {};
	var initWorkflow;
	var workflowEl = angular.element(document
			.querySelector('#workflow_drop_area'));
	workflowservice.getProcessBoxes = getProcessBoxes;
	workflowservice.InitiateJSplumb = InitiateJSplumb;
	workflowservice.setScopeForCanvas = setScopeForCanvas;
	workflowservice.autoConnect = autoConnect;
	workflowservice.onConnect = onConnect;
	workflowservice.onDetach = onDetach;
	workflowservice.onDropBox = onDropBox;
	workflowservice.contextMenus = contextMenus;
	workflowservice.isConnected = isConnected;
	workflowservice.isConnectionLive = isConnectionLive;
	workflowservice.deleteConnectedObjects = deleteConnectedObjects;
	workflowservice.updateWorkFlow = updateWorkFlow;
	workflowservice.updateConnectedDataWithProperties = updateConnectedDataWithProperties;
	workflowservice.createObjectsAndConnect = createObjectsAndConnect;
	var contextMenuCommandDetails = {};
	var counterForScope = 0;
	var scope = "";
	var connectorPaintStyle = {
		strokeWidth : 1,
		stroke : "#ccc",
		joinstyle : "round",
		outlineStroke : "white",
		outlineWidth : 1
	}
	// .. and this is the hover style.
	var connectorHoverStyle = {
		strokeWidth : 1,
		stroke : "#d9d9d9",
		outlineWidth : 1,
		outlineStroke : "white"
	}
	var endpointHoverStyle = {
		fill : "transparent",
		stroke : "#ccc"
	}
	var currentContext = "";
	var currentConnections = ""
	function getProcessBoxes() {
		// http://localhost:8080/orchestrator/workflow/get/initializationdata/initializationdata/initializationdata
		var boxes;
		return $http
				.get(
						'workflow/get/initializationdata/initializationdata/initializationdata')
				.then(handleSuccess, handleError('Error getting all Boxes'));
	}

	function handleSuccess(res) {
		return res.data;
	}

	function handleError(error) {
		return function() {
			return {
				success : false,
				message : error
			};
		};
	}
	function InitiateJSplumb() {
		var initWorkflow = jsPlumb.getInstance({
			// default drag options
			DragOptions : {
				cursor : 'pointer',
				zIndex : 2000
			},
			// the overlays to decorate each connection with. note that the
			// label overlay uses a function to generate the label text; in this
			// case it returns the 'labelText' member that we set on each
			// connection in the 'init' method below.
			ConnectionOverlays : [ [ "Arrow", {
				location : 1,
				visible : true,
				width : 11,
				length : 11,
				id : "ARROW",
				events : {
					click : function() {
						alert("you clicked on the arrow overlay")
					}
				}
			} ], [ "Label", {
				location : 0.1,
				id : "label",
				cssClass : "aLabel",
				events : {
					tap : function() {
					}
				}
			} ] ],
			Container : "canvas"
		});

		return initWorkflow;
	}
	function setScopeForCanvas() {

		console.log("Increment the counter for scope")
		scope = "aConnection" + parseInt(counterForScope)
		counterForScope = parseInt(counterForScope) + parseInt(1);
	}
	function setInitialConnectedData(connectedDataModel) {
		if (connectedDataModel !== undefined) {
			connectedData = connectedDataModel;
		}
		// serealize ConnectedData
		serealizeConnectedData(connectedDataModel);
	}

	function onDropBox(e, u, jp, el, s) {// e=event,
		// u=ui,i=instance,de=draggedelement,s=scope

		console
				.log("An ObjectType was dropped just now on the canvas of workflow to create a new Object");

		var draggedDomId = u.draggable.attr("id");

		// var currentObjectDomId = draggedDomId+ "_" +
		// el.initializationData.objectTypeArray[finalObjectId].id+ "_"+
		// connectedData.objectTypeArray[finalObjectId].objectArray.length +
		// "_";
		for (var i = 0; i < el.initializationData.objectTypeArray.length; i++) {
			if (el.initializationData.objectTypeArray[i].domId === draggedDomId
					&& parseInt(el.initializationData.objectTypeArray[i].maxObjectCount) > parseInt(el.connectedData.objectTypeArray[i].objectDroppedCount)) {
				if (el.initializationData.objectTypeArray[i].domId != 'scheduler'
						&& el.initializationData.objectTypeArray[i].domId != 'event') {
					updateConnectedDataOnSuccessOfValidation(i, u, el, s, jp,
							draggedDomId, "");
				} else {
					if (el.initializationData.objectTypeArray[i].domId === 'scheduler'
							&& el.connectedData.objectTypeArray[7].objectArray.length == 0) {
						updateConnectedDataOnSuccessOfValidation(i, u, el, s,
								jp, draggedDomId, "");
					} else if (el.initializationData.objectTypeArray[i].domId === 'event'
							&& el.connectedData.objectTypeArray[9].objectArray.length == 0) {
						updateConnectedDataOnSuccessOfValidation(i, u, el, s,
								jp, draggedDomId, "");
					} else {
						if (el.initializationData.objectTypeArray[i].domId === 'scheduler') {
							jAlert("Sorry you can't drop <b>"
									+ el.initializationData.objectTypeArray[i].name
									+ "</b> process box because event process box already added in the workflow.If you want add "
									+ el.initializationData.objectTypeArray[i].name
									+ " before you need to remove the event process box");
						} else if (el.initializationData.objectTypeArray[i].domId === 'event') {
							jAlert("Sorry you can't drop <b>"
									+ el.initializationData.objectTypeArray[i].name
									+ "</b> process box because scheduler process box already in the workflow.If you want add "
									+ el.initializationData.objectTypeArray[i].name
									+ " before you need to remove the scheduler process box");

						}
					}
				}
			}
			//
			else if (el.initializationData.objectTypeArray[i].domId === draggedDomId
					&& !(parseInt(el.initializationData.objectTypeArray[i].maxObjectCount) > parseInt(el.connectedData.objectTypeArray[i].objectDroppedCount))) {
				jAlert(el.initializationData.objectTypeArray[i].name
						+ " process box exceeds the maximum count");
			} else {

				var splitdraggedDomId = draggedDomId.split('_');
				var draggedObjectId = splitdraggedDomId[1];
				var draggedObjectBoxId = splitdraggedDomId[2];
				if (el.initializationData.objectTypeArray[i].domId == splitdraggedDomId[0]) {
					$rootScope.connectedData.objectTypeArray[draggedObjectId].objectArray[draggedObjectBoxId].leftPosition = u.position.left;
					$rootScope.connectedData.objectTypeArray[draggedObjectId].objectArray[draggedObjectBoxId].topPosition = u.position.top;
					updateWorkFlow($rootScope.orchestratorId,
							$rootScope.connectedData);
				}

			}
		}
		var currentBoxId;
		var db = el.connectedData.objectTypeArray;
		var bl = db.length - 1;
		var de = db[bl];

		var exampleDropOptions = {
			tolerance : "touch",
			hoverClass : "dropHover",
			activeClass : "dragActive"
		};
	}

	function updateConnectedDataOnSuccessOfValidation(finalObjectId, ui, el, s,
			jp, draggedDomId, validation) {
		console
				.log(el.connectedData.objectTypeArray[finalObjectId].objectDroppedCount);
		var leftposition, topposition;
		var currentObjectDomId = draggedDomId
				+ "_"
				+ el.initializationData.objectTypeArray[finalObjectId].id
				+ "_"
				+ el.connectedData.objectTypeArray[finalObjectId].objectArray.length
				+ "_";
		el.connectedData.objectTypeArray[finalObjectId].objectDroppedCount++;
		var objectId = el.connectedData.objectTypeArray[finalObjectId].objectArray.length;
		if ($(workflowEl).offset().top == 0 || $(workflowEl).offset().left == 0) {
			leftposition = ui.offset.left - ($(workflowEl).offset().left + 285);
			topposition = ui.offset.top - ($(workflowEl).offset().top + 95);
		} else {
			leftposition = ui.offset.left - $(workflowEl).offset().left;
			topposition = ui.offset.top - $(workflowEl).offset().top;
		}
		el.connectedData.objectTypeArray[finalObjectId].objectArray.push({
			id : objectId,
			// idExternal : idExternal, /*No longer required in case of mongo*/
			name : draggedDomId,
			currentObjectDomId : currentObjectDomId,
			inputObjectTypeObjectArray : [],
			outputObjectTypeObjectArray : [],
			properties : "objectTypeProperties",
			domainId : "",
			cellId : "",
			metaDataId : "",
			executionStatus : "normal",
			notificationCount : "",
			leftPosition : leftposition,
			topPosition : topposition,
			objectLive : 1,
			shortName : "",
			longName : "",
			editStatus : "N",
			controlFlag : "N"
		});
		el.connectedData.objectTypeArray.splice(
				el.connectedData.objectTypeArray.length - 1, 1);
		if (validation === "") {
		}

		setTimeout(
				function() {
					s
							.$apply(function() {
								// jp.draggable(jsPlumb.getSelector('#'+
								// currentObjectDomId),{ containment:"#canvas"
								// });
								jp.draggable(jsPlumb.getSelector('#'
										+ currentObjectDomId));
								createSourceEndpoint(
										jp,
										el.initializationData.objectTypeArray[finalObjectId].maxInputCount,
										currentObjectDomId,
										el.initializationData.objectTypeArray[finalObjectId].nodeInputPosition);
								createTargetEndpoint(
										jp,
										el.initializationData.objectTypeArray[finalObjectId].maxOutputCount,
										currentObjectDomId,
										el.initializationData.objectTypeArray[finalObjectId].nodeOutputPosition);

							});
				}, 5);
		updateWorkFlow(s.orchestratorId, s.connectedData);
	}
	function createObject(currentObjectDomId, i, j, u, el) {
		// var objectShortNameLabel = "";
		// if (el.connectedData.objectTypeArray[i].objectArray[j] !== undefined)
		// {
		// if (el.connectedData.objectTypeArray[i].objectArray[j].shortName !==
		// undefined &&
		// parseInt(el.connectedData.objectTypeArray[i].objectArray[j].objectLive)
		// === 1) {
		// objectShortNameLabel =
		// el.connectedData.objectTypeArray[i].objectArray[j].shortName;
		// }
		// }
		el.connectedData.objectTypeArray[i].objectArray[j]['currentObjectDomId'] = currentObjectDomId;
		el.connectedData.objectTypeArray[i].objectArray[j].leftPosition = u.offset.left
				- $(workflowEl).offset().left + 10;
		el.connectedData.objectTypeArray[i].objectArray[j].topPosition = u.offset.top
				- $(workflowEl).offset().top;
	}
	function createWorkflowElement(u, el, db, de, bl) {
		var imgPath = "resources/images/workflow";
		db[bl] = angular.copy(de);

		db[bl]['x'] = u.offset.left - $(workflowEl).offset().left + 50;
		db[bl]['y'] = u.offset.top - $(workflowEl).offset().top;
	}
	function createSourceEndpoint(jp, outputCount, objectDomId, nodePosition) { // outputnode==sourcenode
		// ==
		// isTarget
		// true

		var nodeXPosition = undefined;
		var nodeYPosition = undefined;
		var connectorXDirection = 0;
		var connectorYDirection = 0;
		// for (var i = 1; i <= outputCount; i++) {
		// if (nodePosition === "LEFT" || nodePosition === "RIGHT") {
		// nodeYPosition = (i / outputCount)
		// - (1 / (outputCount * 2));
		// } else if (nodePosition === "BOTTOM"
		// || nodePosition === "TOP") {
		// nodeXPosition = (i / outputCount)
		// - (1 / (outputCount * 2));
		// }
		var sourceEndpointSpec = {
			endpoint : "Dot",
			// anchors : [ nodeXPosition, nodeYPosition, connectorXDirection,
			// connectorYDirection ],
			anchors : [ 'LeftMiddle' ],
			paintStyle : {
				stroke : "#ccc",
				fill : "#ccc",
				radius : 4,
				lineWidth : 2
			},
			isSource : false,
			isTarget : true,
			connectorStyle : {
				stroke : "rgb(67,83,103)",
				lineWidth : 1,
			},
			connectorHoverStyle : {
				lineWidth : 1,
				stroke : "yellow",
			},
			dropOptions : {
				tolerance : "touch",
				hoverClass : "dropHover",
				activeClass : "dragActive"
			},
			beforeDetach : function(conn) {
				return confirm("Detach connection?");
			},
			maxConnections : 10,
			onMaxConnections : function(info) {
				alert("Cannot drop connection " + info.connection.id
						+ " : maxConnections has been reached on Endpoint "
						+ info.endpoint.id);
			}
		}
		jp.addEndpoints($('#' + objectDomId), [ sourceEndpointSpec ]);
		// }
	}
	function createTargetEndpoint(jp, inputCount, objectDomId, nodePosition) {// target==input
		var nodeXPosition = undefined;
		var nodeYPosition = undefined;
		var connectorXDirection = 0;
		var connectorYDirection = 0;
		if (nodePosition === "LEFT") {
			nodeXPosition = 0;
		} else if (nodePosition === "RIGHT") {
			nodeXPosition = 1;
		} else if (nodePosition === "BOTTOM") {
			nodeYPosition = 1;
		} else if (nodePosition === "TOP") {
			nodeYPosition = 0;
		}
		// for (var i = 1; i <= inputCount; i++) {
		// if (nodePosition === "LEFT" || nodePosition === "RIGHT") {
		// nodeYPosition = (i / inputCount)
		// - (1 / (inputCount * 2));
		// } else if (nodePosition === "BOTTOM"
		// || nodePosition === "TOP") {
		// nodeXPosition = (i / inputCount)
		// - (1 / (inputCount * 2));
		// }
		var targetEndpointSpec = {
			endpoint : "Dot",
			// anchors : [ nodeXPosition, nodeYPosition, connectorXDirection,
			// connectorYDirection ],
			anchors : [ 'RightMiddle' ],
			paintStyle : {
				stroke : "#ccc",
				fill : "transparent",
				radius : 4,
				strokeWidth : 1
			},
			isSource : true,
			connector : [ "Flowchart", {
				stub : [ 40, 60 ],
				gap : 10,
				cornerRadius : 5,
				alwaysRespectStubs : true
			} ],
			connectorStyle : connectorPaintStyle,
			hoverPaintStyle : endpointHoverStyle,
			connectorHoverStyle : connectorHoverStyle,
			dragOptions : {},
			maxConnections : 10,
			overlays : [ [ "Label", {
				location : [ 0.5, 1.5 ],
				label : "Drag",
				cssClass : "endpointSourceLabel",
				visible : false
			} ] ]
		}
		jp.addEndpoints($('#' + objectDomId), [ targetEndpointSpec ], {
			connectionsDetachable : true
		});
		// }
	}
	function updateWorkFlow(id, connData) {
		WebService.addData(
				'workflow/edit/updateconnecteddata/updateconnecteddata/'
						+ $rootScope.workflowId, connData).then(function() {
			// alert('chk');
			// $rootScope.$apply();
		})

	}
	// Connect objects if values present in connectedData
	function autoConnect(jp, s) {
		console.log("Auto connecting Objects (if required)")
		$(
				function() {

					// repaint

					// append the objects that are present for a
					// objectType
					setTimeout(function() {
						s
								.$apply(function() {
									// check if autoConnect is required
									var autoConnect = false;

									// moving from one wrkflow to another,
									// getConnections() was getting previous
									// connections,because of the same
									// scope(shruti)

									var connectionsOnScreen = jp
											.getConnections(scope);

									for (var i = 0; i < s.connectedData.objectTypeArray.length; i++) {
										if (s.connectedData.objectTypeArray[i].objectArray.length !== 0) {
											// alert("required")
											autoConnect = true;
											break;
										} else {
											// autoConnect not required
											// alert("not")
											autoConnect = false;
										}
									}
									var objectDomId = "";
									if (autoConnect === true) {
										// paint all the Object that are to be
										// autoconnected with there input/output
										// nodes
										// before connecting remove all dead
										// objects
										// cleanAllDeadObjects();
										for (i = 0; i < s.connectedData.objectTypeArray.length; i++) {
											for (var j = 0; j < s.connectedData.objectTypeArray[i].objectArray.length; j++) {

												// Creating the domid for each
												// object
												objectDomId = s.initializationData.objectTypeArray[i].domId
														+ "_"
														+ i
														+ "_"
														+ j
														+ "_";
												if (true) {
													// createObject(objectDomId,
													// i, j);

													// make the box invalid if
													// executionStatus is "I"
													if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "I"
															|| s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "") {
													}

													// make the box invalid if
													// executionStatus is "V"
													else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "V"
															|| s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "P"
															|| s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "E") {

													}

													// show status-error-icon if
													// executionStatus is "E"
													else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "E") {
													}

													// show
													// status-processed-icon if
													// executionStatus is "P"
													else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "P") {
													}

													// show status-running-icon
													// if
													// executionStatus is "R"
													else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "R") {
													}

													var objectNotificationCount = s.connectedData.objectTypeArray[i].objectArray[j].notificationCount;

													// add notification count if
													// present
													if (objectNotificationCount !== undefined
															&& objectNotificationCount !== ""
															&& objectNotificationCount !== null) {
													}

													// give color of the box
													// $("#" +
													// objectDomId).css({
													// background : "#E8E8E8"//
													// initializationData.objectTypeArray[i].colorCode
													// });

													// Append Short Name of the
													// object
													// $("#" +
													// objectDomId).append('<div
													// style="text-align:
													// center; color:
													// #FFFFFF;margin-top: 45px;
													// font-size: 0.75em">' +
													// initializationData.objectTypeArray[i].name
													// + '</div>');
													// $("#" +
													// objectDomId).append('<div
													// style="text-align:
													// center; color:
													// #000000;margin-top: 15px;
													// font-size: 0.55em">' +
													// connectedData.objectTypeArray[i].objectArray[j].shortName
													// + '</div>');

													// Make objects draggable
													// if (viewType ===
													// undefined
													// || viewType === ""
													// || viewType === null) {

													jp
															.draggable(jsPlumb
																	.getSelector('#'
																			+ objectDomId));

													// }

													// position objects based on
													// the
													// values present inside
													// leftPosition and
													// topPosition
													var leftPositionInPx = s.connectedData.objectTypeArray[i].objectArray[j].leftPosition
															+ "px";
													var topPositionInPx = s.connectedData.objectTypeArray[i].objectArray[j].topPosition
															+ "px";

													// only increment
													// objectDroppedCount
													// if it is not store in DB

													var inputObjectConnectionLiveCount = 0;
													var outputObjectConnectionLiveCount = 0;

													if (s.connectedData.objectTypeArray[i].objectArray[j].inputObjectTypeObjectArray !== undefined) {
														for (var k = 0; k < s.connectedData.objectTypeArray[i].objectArray[j].inputObjectTypeObjectArray.length; k++) {
															if (s.connectedData.objectTypeArray[i].objectArray[j].inputObjectTypeObjectArray[k].connectionLive === 1) {
																inputObjectConnectionLiveCount++;
															}
														}
													}
													if (s.connectedData.objectTypeArray[i].objectArray[j].outputObjectTypeObjectArray !== undefined) {
														for (var k = 0; k < s.connectedData.objectTypeArray[i].objectArray[j].outputObjectTypeObjectArray.length; k++) {
															if (s.connectedData.objectTypeArray[i].objectArray[j].outputObjectTypeObjectArray[k].connectionLive === 1) {
																outputObjectConnectionLiveCount++;
															}
														}
													}

													// jp.draggable(jsPlumb.getSelector('#'+
													// currentObjectDomId +'
													// .dbox'));
													createSourceEndpoint(
															jp,
															s.initializationData.objectTypeArray[i].maxInputCount
																	- inputObjectConnectionLiveCount,
															objectDomId,
															s.initializationData.objectTypeArray[i].nodeInputPosition);
													createTargetEndpoint(
															jp,
															s.initializationData.objectTypeArray[i].maxOutputCount
																	- outputObjectConnectionLiveCount,
															objectDomId,
															s.initializationData.objectTypeArray[i].nodeOutputPosition);
													// jp.addEndpoint(jsPlumb.getSelector(".process_box_"+domId+"
													// .dbox"),
													// exampleEndpoint3);

												}
											}
										}

										// Make connections based on
										// connectedData
										var sourceObjectDomId = "";
										var targetObjectDomId = "";

										// defining sourceEndpointSpec and
										// targetEndpointSpec for connected
										// objects
										function createTargetEndpointSpec(
												removableConnectionState,
												nodePosition) {
											var nodeXPosition = undefined;
											var nodeYPosition = undefined;
											var connectorXDirection = 0;
											var connectorYDirection = 0;
											if (nodePosition === "LEFT") {
												nodeXPosition = 0;
												nodeYPosition = 0.5;
											} else if (nodePosition === "RIGHT") {
												nodeXPosition = 1;
												nodeYPosition = 0.5;
											} else if (nodePosition === "BOTTOM") {
												nodeYPosition = 1;
												nodeXPosition = 0.5;
											} else if (nodePosition === "TOP") {
												nodeYPosition = 0;
												nodeXPosition = 0.5;
											}

											if (removableConnectionState === 0) {
												var targetEndpointSpec = {
													// first two co-ordinates
													// define the
													// postion of the connector,
													// last
													// two co-ordinates define
													// the
													// orientation of the line
													// coming
													// out
													endpoint : "Dot",
													// anchors : [
													// nodeXPosition,
													// nodeYPosition,
													// connectorXDirection,
													// connectorYDirection ],
													anchors : [ 'LeftMiddle' ],
													paintStyle : {
														stroke : "#ccc",
														fill : "#ccc",
														radius : 4,
														lineWidth : 2
													},
													isSource : false,
													isTarget : true,
													maxConnections : 10,
													hoverPaintStyle : connectorHoverStyle,
													connectorHoverStyle : connectorHoverStyle,
													dropOptions : {
														tolerance : "touch",
														activeClass : "dragActive",
														hoverClass : "dragHover"
													}
												}
											} else if (removableConnectionState === 1) {
												targetEndpointSpec = {
													// first two co-ordinates
													// define the
													// postion of the connector,
													// last
													// two co-ordinates define
													// the
													// orientation of the line
													// coming
													// out
													endpoint : "Dot",
													// anchors : [
													// nodeXPosition,
													// nodeYPosition,
													// connectorXDirection,
													// connectorYDirection ],
													anchors : [ 'LeftMiddle' ],
													paintStyle : {
														stroke : "#ccc",
														fill : "#ccc",
														radius : 4,
														lineWidth : 2
													},
													isSource : false,
													isTarget : true,
													maxConnections : 10,
													// hoverPaintStyle :
													// connectorHoverStyle,
													connectorStyle : {
														stroke : "#ccc",
														strokeWidth : 2
													},
													dropOptions : {
														tolerance : "touch",
														activeClass : "dragActive",
														hoverClass : "dragHover"
													}
												}
											}
											return targetEndpointSpec;
										}

										function createSourceEndpointSpec(
												removableConnectionState,
												nodePosition) {
											var nodeXPosition = undefined;
											var nodeYPosition = undefined;
											var connectorXDirection = 0;
											var connectorYDirection = 0;
											if (nodePosition === "LEFT") {
												nodeXPosition = 0;
												nodeYPosition = 0.5;
											} else if (nodePosition === "RIGHT") {
												nodeXPosition = 1;
												nodeYPosition = 0.5;
											} else if (nodePosition === "BOTTOM") {
												nodeYPosition = 1;
												nodeXPosition = 0.5;
											} else if (nodePosition === "TOP") {
												nodeYPosition = 0;
												nodeXPosition = 0.5;
											}

											if (removableConnectionState === 0) {
												var sourceEndpointSpec = {
													// first two co-ordinates
													// define the
													// postion of the connector,
													// last
													// two co-ordinates define
													// the
													// orientation of the line
													// coming
													// out
													anchor : [ "RightMiddle" ],
													endpoint : [ "Dot", {
														radius : 1
													} ],
													// isSource:true,
													detachable : false,
													maxConnections : 10,
													connectorStyle : {
														stroke : "#ccc",
														strokeWidth : 2
													}
												}
											} else if (removableConnectionState === 1) {
												sourceEndpointSpec = {
													// first two co-ordinates
													// define the
													// postion of the connector,
													// last
													// two co-ordinates define
													// the
													// orientation of the line
													// coming
													// out
													endpoint : "Dot",
													// anchors : [
													// nodeXPosition,
													// nodeYPosition,
													// connectorXDirection,
													// connectorYDirection ],
													anchors : [ 'RightMiddle' ],
													paintStyle : {
														stroke : "#ccc",
														fill : "transparent",
														radius : 4,
														strokeWidth : 1
													},
													isSource : true,
													connector : [
															"Flowchart",
															{
																stub : [ 40, 60 ],
																gap : 10,
																cornerRadius : 5,
																alwaysRespectStubs : true
															} ],
													maxConnections : 10,
													connectorStyle : connectorPaintStyle,
													hoverPaintStyle : endpointHoverStyle,
													connectorHoverStyle : connectorHoverStyle
												}
											}
											return sourceEndpointSpec;
										}

										// Connected Object as per connectedData
										for (i = 0; i < s.connectedData.objectTypeArray.length; i++) {

											for (j = 0; j < s.connectedData.objectTypeArray[i].objectArray.length; j++) {
												if (parseInt(s.connectedData.objectTypeArray[i].objectArray[j].objectLive) === 1) {
													if (s.connectedData.objectTypeArray[i].objectArray[j].outputObjectTypeObjectArray !== undefined) {
														for (k = 0; k < s.connectedData.objectTypeArray[i].objectArray[j].outputObjectTypeObjectArray.length; k++) {
															//
															var connectionPresentState = false;
															var removableConnectionState = undefined;
															var sourceObjectTypeId = i;
															var sourceObjectId = j;
															var targetObjectTypeId = s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].objectTypeId;
															var targetObjectId = s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].objectId;
															var targetObjectConnectionLive = s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].connectionLive;

															if ((targetObjectTypeId !== undefined || targetObjectId !== undefined)
																	&& parseInt(targetObjectConnectionLive) !== 0) {
																// setTimeout(function()
																// {},500);
																sourceObjectDomId = s.initializationData.objectTypeArray[sourceObjectTypeId].domId
																		+ "_"
																		+ sourceObjectTypeId
																		+ "_"
																		+ sourceObjectId
																		+ "_";
																targetObjectDomId = s.initializationData.objectTypeArray[targetObjectTypeId].domId
																		+ "_"
																		+ targetObjectTypeId
																		+ "_"
																		+ targetObjectId
																		+ "_";
																// if(connectionsFirLocalScope.length
																// !==0){
																//
																// }
																// if(connectionsOnScreenWithoutCounter.length
																// !== 0 ){
																//
																// }
																if (connectionsOnScreen.length !== 0) {
																	for (var l = 0; l < connectionsOnScreen.length; l++) {
																		if ((connectionsOnScreen[l].sourceId === sourceObjectDomId && connectionsOnScreen[l].targetId === targetObjectDomId)) {
																			connectionPresentState = true;
																		}
																	}
																	if (!connectionPresentState) {
																		// Check
																		// if
																		// the
																		// connection
																		// should
																		// be
																		// removable
																		// or
																		// non-removable
																		if (parseInt(s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].removeConnection) === 0) {
																			// Make
																			// non-removable
																			// connection
																			removableConnectionState = 0;
																			jp
																					.connect({
																						source : jp
																								.addEndpoint(
																										sourceObjectDomId,
																										createSourceEndpointSpec(
																												removableConnectionState,
																												s.initializationData.objectTypeArray[sourceObjectTypeId].nodeOutputPosition)),
																						target : jp
																								.addEndpoint(
																										targetObjectDomId,
																										createTargetEndpointSpec(
																												removableConnectionState,
																												s.initializationData.objectTypeArray[targetObjectTypeId].nodeInputPosition))

																					});
																		} else {
																			// Make
																			// removable
																			// connection
																			removableConnectionState = 1;
																			jp
																					.connect({
																						source : jp
																								.addEndpoint(
																										sourceObjectDomId,
																										createSourceEndpointSpec(
																												removableConnectionState,
																												s.initializationData.objectTypeArray[sourceObjectTypeId].nodeOutputPosition)),
																						target : jp
																								.addEndpoint(
																										targetObjectDomId,
																										createTargetEndpointSpec(
																												removableConnectionState,
																												s.initializationData.objectTypeArray[targetObjectTypeId].nodeInputPosition))
																					});
																		}
																		// initializationData.objectTypeArray[sourceObjectTypeId].maxObjectCount++;
																		// initializationData.objectTypeArray[targetObjectTypeId].maxObjectCount++;
																		// createInputNodes(initializationData.objectTypeArray[sourceObjectTypeId].maxOutputCount,
																		// targetObjectDomId);
																		// createOutputNodes(initializationData.objectTypeArray[targetObjectTypeId].maxInputCount,
																		// sourceObjectDomId);
																	}
																}

																else {
																	// Check if
																	// the
																	// connection
																	// should
																	// be
																	// removable
																	// or
																	// non-removable
																	if (parseInt(s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].removeConnection) === 0) {
																		// Make
																		// non-removable
																		// connection
																		removableConnectionState = 0;
																		jp
																				.connect({
																					source : jp
																							.addEndpoint(
																									sourceObjectDomId,
																									createSourceEndpointSpec(
																											removableConnectionState,
																											s.initializationData.objectTypeArray[sourceObjectTypeId].nodeOutputPosition)),
																					target : jp
																							.addEndpoint(
																									targetObjectDomId,
																									createTargetEndpointSpec(
																											removableConnectionState,
																											s.initializationData.objectTypeArray[targetObjectTypeId].nodeInputPosition))

																				});
																	} else {

																		// Make
																		// removable
																		// connection
																		removableConnectionState = 1;
																		jp
																				.connect({
																					source : jp
																							.addEndpoint(
																									sourceObjectDomId,
																									createSourceEndpointSpec(
																											removableConnectionState,
																											s.initializationData.objectTypeArray[sourceObjectTypeId].nodeOutputPosition)),
																					target : jp
																							.addEndpoint(
																									targetObjectDomId,
																									createTargetEndpointSpec(
																											removableConnectionState,
																											s.initializationData.objectTypeArray[targetObjectTypeId].nodeInputPosition))

																				})
																	}
																}

															}
														}
													}
												}
											}
										}
									} else {
										// AutoConnect Not Required
									}
									// cleanAllDeadObjects();

									if (s.connectedData.diagramTypeInstance == null
											|| s.connectedData.diagramTypeInstance == undefined
											|| s.connectedData.diagramTypeInstance == "") {
										updateWorkFlow(s.orchestratorId,
												s.connectedData);
									} else {
										updateWorkFlow(s.orchestratorId,
												s.connectedData);
									}
								})
					});
				}, 2000);
	}
	function onConnect(jp, s) {
		console.log("Listnes if two objects are getting connected");
		// When connections are made, do required validations and populate the
		// connectedData object

		jp
				.bind(
						"connection",
						function(con) {
							console
									.log("Two objects are getting connected just now");
							// Figuring out the details for source and target
							// based on domIds

							var sourceIds = con.sourceId.split("_");
							var targetIds = con.targetId.split("_");
							var sourceObjectTypeId = parseInt(sourceIds[1]);
							var sourceObjectId = parseInt(sourceIds[2]);
							var targetObjectTypeId = parseInt(targetIds[1]);
							var targetObjectId = parseInt(targetIds[2]);
							var connectionAllowed = 0;

							// Check if connection should be
							// allowed based on
							// initializationData for source and
							// target
							for (var i = 0; i < (s.initializationData.objectTypeArray[sourceObjectTypeId].outputObjectTypeAllowedArray.length); i++) {
								var sourceOutputAllowed = parseInt(s.initializationData.objectTypeArray[sourceObjectTypeId].outputObjectTypeAllowedArray[i].id);

								if (sourceOutputAllowed === targetObjectTypeId) {
									connectionAllowed = 1;
								}
							}
							// Go inside if connection is
							// allowed
							if (connectionAllowed === 1) {
								// for execute option in
								// contextMenu add another class
								var execute = false;
								if (s.initializationData.objectTypeArray[sourceObjectTypeId].domId === "fileread") {
									if (sourceObjectTypeId === targetObjectTypeId) {

									}
								}
								var targetObjectLeftPosition = $(
										"#"
												+ s.initializationData.objectTypeArray[targetObjectTypeId].domId
												+ "_" + targetObjectTypeId
												+ "_" + targetObjectId + "_")
										.position().left;
								var targetObjectTopPosition = $(
										"#"
												+ s.initializationData.objectTypeArray[targetObjectTypeId].domId
												+ "_" + targetObjectTypeId
												+ "_" + targetObjectId + "_")
										.position().top;
								pushObjectAndMakeAConnectionInConnectedData(s,
										con.sourceId, con.targetId,
										targetObjectLeftPosition,
										targetObjectTopPosition);
							} else {
								// detach
								console.log(con);
								var params = {
									force : true
								}
								jp.deleteConnection(con.connection, params)
								// jsPlumb.deleteConnection(con.sourceId,
								// con.targetId);
								alert('Sorry Connection is not Allowed');

							}
							updateWorkFlow(s.orchestratorId, s.connectedData);

						});
	}
	function onDetach(jp, event) {
		console.log("Listnes if two objects are getting disconnected");
		// alert('detach')
		// When connections are removed, do required validations
		// and update the connectedData object
		jp.bind("connectionDetached", function(con) {
			var sourceIds = con.sourceId.split("_");
			var targetIds = con.targetId.split("_");
			var sourceObjectTypeId = parseInt(sourceIds[1]);
			var sourceObjectId = parseInt(sourceIds[2]);
			var targetObjectTypeId = parseInt(targetIds[1]);
			var targetObjectId = parseInt(targetIds[2]);
			if ((sourceObjectTypeId === 7 || sourceObjectTypeId === 8)
					&& targetObjectTypeId === 9) {
				if (window.event.type === "mouseup") {
					jp.connect(con);
					jAlert("Not Allowed", "Alert Dialog");
				} else {
					beforeDetach(con, sourceObjectTypeId, sourceObjectId,
							targetObjectTypeId, targetObjectId)
				}

			}

			else {
				beforeDetach(con, sourceObjectTypeId, sourceObjectId,
						targetObjectTypeId, targetObjectId);
			}

		})
	}
	function beforeDetach(con, sourceObjectTypeId, sourceObjectId,
			targetObjectTypeId, targetObjectId) {
		console
				.log("Two objects are getting disconnected just now beforedetach");
		for (var i = 0; i < $rootScope.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray.length; i++) {

			if (parseInt($rootScope.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[i].objectTypeId) === targetObjectTypeId
					&& parseInt($rootScope.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[i].objectId) === targetObjectId) {
				$rootScope.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[i].connectionLive = 0;
			}
		}
		for (i = 0; i < $rootScope.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].inputObjectTypeObjectArray.length; i++) {
			if (parseInt($rootScope.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].inputObjectTypeObjectArray[i].objectTypeId) === sourceObjectTypeId
					&& parseInt($rootScope.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].inputObjectTypeObjectArray[i].objectId) === sourceObjectId) {
				$rootScope.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].inputObjectTypeObjectArray[i].connectionLive = 0;
			}
		}

		// execute option in contextMenu(shruti)

		// var workflow = new CCTarget.Workflow.WorkflowView();
		updateWorkFlow($rootScope.connectedData.orchestratorid,
				$rootScope.connectedData);

	}

	function pushObjectAndMakeAConnectionInConnectedData(s, sourceId, targetId,
			objectLeftPosition, objectTopPosition) {
		console.log(sourceId);
		var sourceIds = sourceId.split("_");
		var targetIds = targetId.split("_");
		var sourceObjectTypeId = parseInt(sourceIds[1]);
		var sourceObjectId = parseInt(sourceIds[2]);
		var targetObjectTypeId = parseInt(targetIds[1]);
		var targetObjectId = parseInt(targetIds[2]);
		var connectionAllowed = 0;

		// Check if connection should be allowed based on
		// initializationData for source and target
		for (var i = 0; i < (s.initializationData.objectTypeArray[sourceObjectTypeId].outputObjectTypeAllowedArray.length); i++) {
			var sourceOutputAllowed = parseInt(s.initializationData.objectTypeArray[sourceObjectTypeId].outputObjectTypeAllowedArray[i].id);

			if (sourceOutputAllowed === targetObjectTypeId) {
				connectionAllowed = 1;
			}
		}

		// Go inside if connection is allowed
		if (connectionAllowed === 1) {

			var pushObject = 0;
			var pushConnection = 1;

			// Source
			var sourceObjectCreatedArray = [];
			var sourceObjectOutputArray = [];
			// Check if the same connection exist or use to exist
			// Check if any Objects are present for
			// sourceObjectTypeId
			if (s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray.length !== 0) {
				// 1 or more objects present
				// Interate through all the objects of
				// sourceObjectTypeId
				for (var i = 0; i < s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray.length; i++) {
					// Check if the sourceObjectId already exists in
					// the objectArray
					var intValueOfId = parseInt(s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i]._id)
					if (s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].id === sourceObjectId
							|| intValueOfId === sourceObjectId) {
						pushObject = 0;
						// Interate through all the
						// outputObjectTypeObjectArray
						// if(connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].hasOwnProperty("outputObjectTypeObjectArray")){
						if (s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].outputObjectTypeObjectArray !== undefined
								|| s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i]
										.hasOwnProperty("outputObjectTypeObjectArray")) {
							for (var j = 0; j < s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].outputObjectTypeObjectArray.length; j++) {
								// Check if the objectTypeId,
								// objectId match with the
								// targetObjectTypeId and
								// targetObjectId respectively and
								// whether the connection is live or
								// not
								var intValueOfObjectTypeId = parseInt(s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].outputObjectTypeObjectArray[j].objectTypeId);
								var intValueOFObjectId = parseInt(s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].outputObjectTypeObjectArray[j].objectId);
								var intValueOfConnectionLive = parseInt(s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].outputObjectTypeObjectArray[j].connectionLive);

								if (intValueOfObjectTypeId === targetObjectTypeId
										&& intValueOFObjectId === targetObjectId
										&& intValueOfConnectionLive === 1) {
									// Exact connection exists
									pushObject = 0;
									pushConnection = 0;
									break;
								} else if (intValueOfObjectTypeId === targetObjectTypeId
										&& intValueOFObjectId === targetObjectId
										&& intValueOfConnectionLive === 0) {
									// Same Connection used to
									// exist, make it live
									s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[i].outputObjectTypeObjectArray[j].connectionLive = 1;
									pushObject = 0;
									pushConnection = 0;
								}

							}
						} else {
							pushObject = 0;
							pushConnection = 1;
						}
						// if pushConnection is not set to 0, then
						// the connection needs to be set for in
						// outputObjectTypeObjectArray for the
						// object
						if (pushConnection !== 0) {
							// Object exists, pushObject = 0
							pushObject = 0;
							// Connection does not exist,
							// pushConnection = 1
							pushConnection = 1;
							break;
						}
					} else {
						// sourceObjectTypeId does not exist in the
						// objectArray for this iteration
					}
				}
			} else {
				// No object present for sourceObjectTypeId
				// should never be possible;
				pushObject = 1;
				pushConnection = 1;
			}

			// Assign/Push values based on the pushConnection state
			if (pushObject === 0 && pushConnection === 1) {
				// Save what ever is present in
				// outputObjectTypeObjectArray for Source
				sourceObjectOutputArray = s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray;

				// Assign value to objectArray.id
				s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].id = sourceObjectId

				// updateObjectCoOrdinates(sourceObjectTypeId,
				// sourceObjectId);
				// Find value for left and top for sourceObject
				/*
				 * var sourceObjectLeftPosition = $("#" +
				 * initializationData.objectTypeArray[sourceObjectTypeId].domId +
				 * "_" + sourceObjectTypeId + "_" + sourceObjectId +
				 * "_").position().left; var sourceObjectTopPosition = $("#" +
				 * initializationData.objectTypeArray[sourceObjectTypeId].domId +
				 * "_" + sourceObjectTypeId + "_" + sourceObjectId +
				 * "_").position().top;
				 * 
				 * //Assign values to leftPosition and topPosition
				 * connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].leftPosition =
				 * sourceObjectLeftPosition;
				 * connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].topPosition =
				 * sourceObjectTopPosition;
				 */
				// Push the new values (connections made) inside
				// sourceObjectOutputArray
				sourceObjectOutputArray.push({
					objectTypeId : targetObjectTypeId,
					objectId : targetObjectId,
					connectionLive : 1
				});

				// Copy the objectArray of sourceObjectTypeId
				sourceObjectCreatedArray = s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray;
				s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray = sourceObjectCreatedArray;
			}

			pushObject = 0;
			pushConnection = 1;

			// Target
			var targetObjectCreatedArray = [];
			var targetObjectInputArray = [];
			// Check if the same connection exist or use to exist
			// Check if any Objects are present for
			// sourceObjectTypeId

			if (s.connectedData.objectTypeArray[targetObjectTypeId].objectArray.length !== 0) {
				// 1 or more objects present
				// Interate through all the objects of
				// sourceObjectTypeId
				for (var i = 0; i < s.connectedData.objectTypeArray[targetObjectTypeId].objectArray.length; i++) {
					// Check if the sourceObjectId already exists in
					// the objectArray
					var intValueOfId = parseInt(s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i]._id)
					if (s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].id === targetObjectId
							|| intValueOfId === targetObjectId) {
						pushObject = 0;
						// Interate through all the
						// inputObjectTypeObjectArray
						if (s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i]
								.hasOwnProperty("inputObjectTypeObjectArray")
								|| s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray !== undefined) {
							for (var j = 0; j < s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray.length; j++) {
								// Check if the objectTypeId,
								// objectId match with the
								// targetObjectTypeId and
								// targetObjectId respectively and
								// whether the connection is live or
								// not
								var intValueOfObjectTypeId = parseInt(s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray[j].objectTypeId);
								var intValueOFObjectId = parseInt(s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray[j].objectId);
								var intValueOfConnectionLive = parseInt(s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray[j].connectionLive);
								if (intValueOfObjectTypeId === sourceObjectTypeId
										&& intValueOFObjectId === sourceObjectId
										&& intValueOfConnectionLive === 1) {
									// Exact connection exists
									pushObject = 0;
									pushConnection = 0;
									break;
								} else if (intValueOfObjectTypeId === sourceObjectTypeId
										&& intValueOFObjectId === sourceObjectId
										&& intValueOfConnectionLive === 0) {
									// Same Connection used to
									// exist, make it live
									s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray[j].connectionLive = 1;
									pushObject = 0;
									pushConnection = 0;
								}
							}
						} else {
							pushObject = 0;
							pushConnection = 1;
						}
						// if pushConnection is not set to 0, then
						// the connection needs to be set for in
						// inputObjectTypeObjectArray for the object
						if (pushConnection !== 0) {
							// Object exists, pushObject = 0
							pushObject = 0;
							// Connection does not exist,
							// pushConnection = 1
							pushConnection = 1;
							break;
						}
					} else {
						// sourceObjectTypeId does not exist in the
						// objectArray for this iteration
					}
				}
			} else {
				// No object present for targetObjectTypeId
				// should never be possible;
				pushObject = 1;
				pushConnection = 1;
			}

			// Assign/Push values based on the pushConnection state
			if (pushObject === 0 && pushConnection === 1) {

				// Save what ever is present in
				// inputObjectTypeObjectArray for Source
				targetObjectInputArray = s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].inputObjectTypeObjectArray;

				// Assign value to objectArray.id
				s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].id = targetObjectId

				// Assign values to leftPosition and topPosition
				// s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].leftPosition
				// = objectLeftPosition;
				// s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].topPosition
				// = objectTopPosition;

				// Push the new values (connections made) inside
				// targetObjectInputArray
				targetObjectInputArray.push({
					objectTypeId : sourceObjectTypeId,
					objectId : sourceObjectId,
					connectionLive : 1
				});

				// Copy the objectArray of sourceObjectTypeId
				targetObjectCreatedArray = s.connectedData.objectTypeArray[targetObjectTypeId].objectArray;
				s.connectedData.objectTypeArray[targetObjectTypeId].objectArray = targetObjectCreatedArray;
				if (targetObjectTypeId === 5) {
					s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].domainId = "164_0";
					s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].executionStatus = "active"
				}
			}
		} else {
			// connection not allowed
		}
	}
	function updateConnectedDataWithProperties(s, diagramType, objectTypeId,
			ObjectId, domainId, workflowId, sourceId, shortName, longName,
			samplingDetails) {

		diagramType = parseInt(diagramType);
		objectTypeId = parseInt(objectTypeId);
		ObjectId = parseInt(ObjectId);

		var currentObjectDomId = s.initializationData.objectTypeArray[objectTypeId].domId
				+ "_" + objectTypeId + "_" + ObjectId + "_";

		if (domainId !== undefined && domainId !== "") {
			s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].domainId = domainId;
			s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].executionStatus = "active";
			s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].shortName = shortName;
			s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].longName = longName;
			s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].metaDataId = sourceId;
		}
		// updateSource(s,diagramType, objectTypeId, ObjectId,
		// domainId,workflowId,sourceId);
		updateWorkFlow(workflowId, s.connectedData);
	}
	// function updateSource(s,diagramType, objectTypeId, ObjectId,
	// domainId,workflowId,sourceId){
	// diagramType = parseInt(diagramType);
	// objectTypeId = parseInt(objectTypeId);
	// ObjectId = parseInt(ObjectId);
	// var targetBoxTypeId;
	// var targetBoxObjectId;
	// var
	// targetBoxes=s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].outputObjectTypeObjectArray.length;
	// for(var i=0;i<targetBoxes;i++){
	// //if(s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].outputObjectTypeObjectArray[i].connectionLive!==0){
	// targetBoxTypeId =
	// s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].outputObjectTypeObjectArray[i].objectTypeId;
	// targetBoxObjectId=s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].outputObjectTypeObjectArray[i].objectId;
	// s.connectedData.objectTypeArray[targetBoxTypeId].objectArray[targetBoxObjectId].inputObjectTypeObjectArray[i].domainId=domainId;
	// //}
	// }
	// }
	function contextMenus(details) {
		console.log(details);
		currentContext = details;
		$
				.contextMenu({
					selector : ".dbox",
					callback : function(key, options) {
						if (key === "execute") {

						} else if (key === "deleteObject") {
							var idSplit = ($(this).attr('id')).split("_");
							var objectTypeId = idSplit[1];
							var objectId = idSplit[2];
							var domainId = $rootScope.connectedData.objectTypeArray[objectTypeId].objectArray[objectId].domainId
							var returnObject = {
								command : key,
								clickedObjectTypeId : objectTypeId,
								clickedObjectId : objectId,
								clickedDomainId : domainId
							}
							removeObject(currentContext.deleteObject,
									currentContext.context, objectTypeId,
									objectId, returnObject)
							// executeFunctionByName(currentContext.deleteObject,
							// currentContext.context,
							// returnObject,
							// currentContext.context)
						}
					},
					items : {
						/*
						 * "singleexecute" : { name : "Execute Node", icon :
						 * "edit", disabled : false }, "execute" : { name :
						 * "Execute Branch", icon : "edit", disabled : false },
						 * "cut" : { name : "Cut", icon : "cut", disabled : true },
						 * "copy" : { name : "Copy", icon : "copy", disabled :
						 * true }, "paste" : { name : "Paste", icon : "paste",
						 * disabled : true },
						 */
						"deleteObject" : {
							name : "Delete",
							icon : "delete",
							disabled : false
						}
					/*
					 * , "sep1" : "---------", "quit" : { name : "Quit", icon :
					 * "quit", disabled : true }
					 */
					}
				});
	}
	function removeObject(deleteObject, context, ObjectTypeIndex, ObjectIndex,
			returnObject) {
		console
				.log("Defining and declaring method - removeObject for removing object boxes from workflow");

		var allowedStatus = 1;

		if ($rootScope.connectedData.objectTypeArray[ObjectTypeIndex].objectArray[ObjectIndex].inputObjectTypeObjectArray !== undefined) {
			for (var i = 0; i < $rootScope.connectedData.objectTypeArray[ObjectTypeIndex].objectArray[ObjectIndex].inputObjectTypeObjectArray.length; i++) {
				if (parseInt($rootScope.connectedData.objectTypeArray[ObjectTypeIndex].objectArray[ObjectIndex].inputObjectTypeObjectArray[i].connectionLive) === 1) {
					jAlert(
							"Please remove all connections before deleting the box",
							"Alert Dialog");
					allowedStatus = 0;
				}
			}
		}
		if ($rootScope.connectedData.objectTypeArray[ObjectTypeIndex].name != "Segmentation") {
			if ($rootScope.connectedData.objectTypeArray[ObjectTypeIndex].objectArray[ObjectIndex].outputObjectTypeObjectArray !== undefined) {
				for (var i = 0; i < $rootScope.connectedData.objectTypeArray[ObjectTypeIndex].objectArray[ObjectIndex].outputObjectTypeObjectArray.length; i++) {
					if (parseInt($rootScope.connectedData.objectTypeArray[ObjectTypeIndex].objectArray[ObjectIndex].outputObjectTypeObjectArray[i].connectionLive) === 1) {
						jAlert(
								"Please remove all connections before deleting the box",
								"Alert Dialog");
						allowedStatus = 0;
					}
				}
			}
		} else {
			allowedStatus = 1;
		}
		if (allowedStatus === 1) {
			if (ObjectTypeIndex !== "6" && ObjectTypeIndex !== "3") {
				jConfirm('Can you confirm this?', 'Confirmation Dialog',
						function(result) {
							if (result === true) {
								executeFunctionByName(deleteObject, context,
										returnObject, context)

							}
						})
			} else {

				executeFunctionByName(deleteObject, context, returnObject,
						context)

			}
		}
	}

	function executeFunctionByName(functionName, context) {

		var args = Array.prototype.slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		for (var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		return context[func].apply(this, args);
		// $rootScope.$apply(function() {
		// console.log($rootScope.connectedData.objectTypeArray[rObject.clickedObjectTypeId].objectArray[rObject.clickedObjectId])
		// $rootScope.connectedData.objectTypeArray[rObject.clickedObjectTypeId].objectArray.splice(rObject.clickedObjectId,
		// 1);
		//        	
		// });
	}
	// check process boxes are connected . return true when boxes are connected
	// otherwise false
	function isConnected(selId, objId) {
		var returnstring = {};
		var status;
		var boxname = $rootScope.connectedData.objectTypeArray[selId].name;
		var connectedDataModel = $rootScope.connectedData.objectTypeArray[selId].objectArray[objId].inputObjectTypeObjectArray.length;

		if (connectedDataModel === 0) {
			return false;
		} else {
			return true;
		}

	}

	function isConnectionLive(selId, objId) {
		var returnstring = {};
		var status;
		var boxname = $rootScope.connectedData.objectTypeArray[selId].name;
		var connectedDataModel = $rootScope.connectedData.objectTypeArray[selId].objectArray[objId].inputObjectTypeObjectArray.length;
		for (var i = 0; i < connectedDataModel; i++) {
			var objectid = $rootScope.connectedData.objectTypeArray[selId].objectArray[objId].inputObjectTypeObjectArray[i].objectId
			var objectTypeId = $rootScope.connectedData.objectTypeArray[selId].objectArray[objId].inputObjectTypeObjectArray[i].objectTypeId
			// if (parseInt(objectTypeId) !== 9 && parseInt(objectTypeId) !== 5)
			// {
			var domainid = $rootScope.connectedData.objectTypeArray[objectTypeId].objectArray[objectid].domainId;
			if (parseInt($rootScope.connectedData.objectTypeArray[selId].objectArray[objId].inputObjectTypeObjectArray[i].connectionLive) === 1) {
				if (domainid === "" || domainid === " " || domainid === null
						|| domainid === undefined) {
					return false;
				} else {
					return true;
				}
			}
		}
	}

	function deleteConnectedObjects(sourceDomId, targetObjectTypeId) {
		var sourceObjectDomIdSplit = sourceDomId.split("_");
		var connectedData = $rootScope.connectedData;
		var initializationData = $rootScope.initializationData;
		var sourceObjectTypeId = parseInt(sourceObjectDomIdSplit[1]);
		var sourceObjectId = parseInt(sourceObjectDomIdSplit[2])

		for (var i = 0; i < connectedData.objectTypeArray[targetObjectTypeId].objectArray.length; i++) {

			if (parseInt(connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].objectLive) === 1) {

				for (var j = 0; j < connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray.length; j++) {
					if (parseInt(connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray[j].objectTypeId) === sourceObjectTypeId
							&& parseInt(connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].inputObjectTypeObjectArray[j].objectId) === sourceObjectId) {

						for (var j = 0; j < connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].outputObjectTypeObjectArray.length; j++) {
							if (parseInt(connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].outputObjectTypeObjectArray[j].connectionLive) === 1) {
								connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].outputObjectTypeObjectArray[j].connectionExists = "Y"
							}
						}

						var objectDomId = initializationData.objectTypeArray[targetObjectTypeId].domId
								+ "_" + targetObjectTypeId + "_" + i + "_";
						// var getAllEndPoints =
						// creatNewInstance.getEndpoints(objectDomId);
						// //removeEveryEndpoint
						//
						// for(var g = 0 ; g < getAllEndPoints.length ; g++){
						// creatNewInstance.removeEndpoint("",getAllEndPoints[g])
						// }
						// // creatNewInstance.removeEveryEndpoint(objectDomId);
						// jp.removeAllEndpoints(objectDomId);
						$("#" + objectDomId).remove();
						connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].objectLive = 0;
						// connectedData.objectTypeArray[targetObjectTypeId].objectArray[i].removeObject
						// = "Y";

						for (var k = 0; k < connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray.length; k++) {
							if (parseInt(connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].objectTypeId) === targetObjectTypeId
									&& parseInt(connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].objectId) === i) {
								connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].connectionLive = 0;
							}
						}
					}
				}
			}
		}
		for (var k = 0; k < connectedData.objectTypeArray.length; k++) {
			for (var l = connectedData.objectTypeArray[k].objectArray.length
					- parseInt(1); l >= 0; l--) {
				if (connectedData.objectTypeArray[k].objectArray[l].objectLive === 0) {
					connectedData.objectTypeArray[k].objectArray.splice(l, 1);
				}
			}
		}
		// setScopeForCanvas();
		// $rootScope
		// autoConnect(jp, $rootScope);
	}

	function createObjectsAndConnect(s, sourceDomId, targetObjectTypeId,
			numberOfObjects) {
		var connectedData = $rootScope.connectedData;
		var initializationData = $rootScope.initializationData;
		var sourceObjectDomIdSplit = sourceDomId.split("_");
		var sourceObjectTypeId = parseInt(sourceObjectDomIdSplit[1]);
		var sourceObjectId = parseInt(sourceObjectDomIdSplit[2]);
		var domainIdForSeg = null;
		// if(sourceObjectTypeId==3)
		// {
		var domainIdForSeg = connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].domainId
		// }

		var leftPosition = parseInt(connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].leftPosition)
				- (50 * (numberOfObjects / 2));
		for (var i = 0; i < numberOfObjects; i++) {
			var targetObjectId = connectedData.objectTypeArray[targetObjectTypeId].objectArray.length;
			var targetDomId = initializationData.objectTypeArray[targetObjectTypeId].domId
					+ "_" + targetObjectTypeId + "_" + targetObjectId + "_";
			leftPosition = leftPosition + 100;
			var topPosition = parseInt(connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].topPosition) + 200
			connectedData.objectTypeArray[targetObjectTypeId].objectArray
					.push({
						"id" : targetObjectId,
						// idExternal : idExternal, /*No longer required in case
						// of mongo*/
						"name" : "cells",
						"currentObjectDomId" : targetDomId,
						"inputObjectTypeObjectArray" : [],
						"outputObjectTypeObjectArray" : [],
						"properties" : "objectTypeProperties",
						"domainId" : domainIdForSeg + "_" + targetObjectId,
						"cellId" : "",
						"metaDataId" : "",
						"executionStatus" : "normal",
						"notificationCount" : "",
						"leftPosition" : leftPosition,
						"topPosition" : topPosition,
						"objectLive" : 1,
						"shortName" : "",
						"longName" : "",
						"editStatus" : "N",
						"controlFlag" : "N"
					});
			pushObjectAndMakeAConnectionInConnectedData($rootScope,
					sourceDomId, targetDomId, leftPosition, topPosition);
		}
	}

	return workflowservice;
}