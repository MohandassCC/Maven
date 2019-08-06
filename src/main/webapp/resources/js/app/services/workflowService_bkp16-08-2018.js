angular.module('importApp').factory('WorkflowService', WorkflowService);
WorkflowService.$inject = [ '$http', '$q' ,'$rootScope','WebService'];

function WorkflowService($http, $q,$rootScope,WebService) {
	var workflowservice = {};
	var initWorkflow;
	var workflowEl = angular.element( document.querySelector( '#workflow-frame' ) );
	workflowservice.getProcessBoxes = getProcessBoxes;
	workflowservice.InitiateJSplumb = InitiateJSplumb;
	workflowservice.setScopeForCanvas = setScopeForCanvas;	
	workflowservice.autoConnect = autoConnect;
	workflowservice.onConnect = onConnect;
	workflowservice.onDetach = onDetach;
	workflowservice.onDropBox = onDropBox;
	workflowservice.contextMenus = contextMenus;
	workflowservice.updateConnectedDataWithProperties=updateConnectedDataWithProperties;
	var contextMenuCommandDetails = {};
	var counterForScope = 0;
	var scope = "";

	var currentContext = "";
	var currentConnections = ""
	function getProcessBoxes() {
		//http://localhost:8080/orchestrator/workflow/get/initializationdata/initializationdata/initializationdata
		var boxes;
		return $http.get('workflow/get/initializationdata/initializationdata/initializationdata').then(handleSuccess, handleError('Error getting all Boxes'));	
	}
	
	function handleSuccess(res) {
		return res.data;
	}

	function handleError(error) {
		return function () {
			return {
				success: false,
				message: error
			};
		};
	}
	function InitiateJSplumb() {
		var initWorkflow = jsPlumb.getInstance({
			DragOptions: { cursor: 'pointer', zIndex: 2000 },			
            PaintStyle: { stroke: '#666' },
           // EndpointHoverStyle: { fill: "orange" },
           // HoverPaintStyle: { stroke: "orange" },
            EndpointStyle: { width: 20, height: 16, stroke: '#666' },
            Endpoint: "Dot",
            Anchors: ["TopCenter", "TopCenter"],
			Container: "workflow-frame"
		});
		
		
		console.log("Defining the default type of Connector for jsPlumb");
		//$('#workflow-frame').droppable();
		//initWorkflow.Defaults.Connector = "Straight";

		initWorkflow.importDefaults({
			ConnectionsDetachable: true,
			ReattachConnections:false,
			connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
			Endpoints : [ [ "Dot", { radius:5} ], [ "Dot", { radius:6} ] ],
			EndpointStyles : [{ strokeStyle:"white",fillStyle:"transparent",lineWidth:2 }, 
			   			{ strokeStyle:"white", fillStyle:"white",lineWidth:0  }],
   			HoverPaintStyle : {lineWidth:5,strokeStyle:"yellow"},
   			Overlays:[ 
				["Arrow" , { width:12, location:1 }]
		    ],
			anchor : [ "Continuous" ],
			PaintStyle: { lineWidth : 3, strokeStyle : "white" ,strokeWidth:1},
			Container: "workflow_drop_area"
		})
		
		console.log("Defining the default PaintStyle of connector for jsPlumb");

		

		console
				.log("Defining the default EndpointStyle of connector for jsPlumb");
//
//		initWorkflow.Defaults.EndpointStyle = {
//			fillStyle : '#d3d3d2'
//		};

		// arrow
		console.log("Defining the default Overlays of connector for jsPlumb");
//		initWorkflow.Defaults.Overlays = [ [ "Arrow", {
//			width : 15,
//			length : 15,
//			location : 1
//
//		} ], ];
		initWorkflow.draggable(".drag-drop-demo .window");
		initWorkflow.bind("contextmenu", function(component, originalEvent) {
            alert("context menu on component " + component.id);
            originalEvent.preventDefault();
            return false;
        });
		//initWorkflow.draggable(jsPlumb.getSelector(".drag-drop-demo .window"));
		//var e1 = initWorkflow.addEndpoint("dragDropWindow1");
		return initWorkflow;
	}
	function setScopeForCanvas() {
		// shruti
		console.log("Increment the counter for scope")
		scope = "aConnection" + parseInt(counterForScope)
		counterForScope = parseInt(counterForScope)
				+ parseInt(1);
	}	
	function setInitialConnectedData(connectedDataModel) {
		if (connectedDataModel !== undefined) {
			connectedData = connectedDataModel;
		}
		// serealize ConnectedData
		serealizeConnectedData(connectedDataModel);
	}
	
	function onDropBox(e, u,jp,el,s){//e=event, u=ui,i=instance,de=draggedelement,s=scope
		
		console.log("An ObjectType was dropped just now on the canvas of workflow to create a new Object");
		
		var draggedDomId = u.draggable.attr("id");
		//var currentObjectDomId = draggedDomId+ "_" + el.initializationData.objectTypeArray[finalObjectId].id+ "_"+ connectedData.objectTypeArray[finalObjectId].objectArray.length	+ "_";
		for (var i = 0; i < el.initializationData.objectTypeArray.length; i++) {
			if (el.initializationData.objectTypeArray[i].domId === draggedDomId && parseInt(el.initializationData.objectTypeArray[i].maxObjectCount) > parseInt(el.connectedData.objectTypeArray[i].objectDroppedCount)) {
				updateConnectedDataOnSuccessOfValidation(i, u,el,s,jp,draggedDomId, "");
			}
			
		}
		var currentBoxId;
		var db=el.connectedData.objectTypeArray;	
		var bl=db.length - 1;
		var de=db[bl];
		//var coi=".process_box_"+domId+" .dbox";
		
		//createWorkflowElement(u,el,db,de,bl);
		
		var exampleDropOptions = {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            };
		
	
//		 setTimeout(function() {
//			 s.$apply(function() {
//				 jp.draggable(jsPlumb.getSelector(coi));
//				 createSourceEndpoint(jp,de,coi);
//				 createTargetEndpoint(jp,de,coi);
//				// jp.addEndpoint(jsPlumb.getSelector(".process_box_"+domId+" .dbox"), exampleEndpoint3);
//				 
//		      });
//		 }, 5);
	
	}
	
	function updateConnectedDataOnSuccessOfValidation(finalObjectId, ui,el, s,jp,draggedDomId, validation){
		console.log(el.connectedData.objectTypeArray[finalObjectId].objectDroppedCount);
		 var currentObjectDomId = draggedDomId + "_" + el.initializationData.objectTypeArray[finalObjectId].id + "_" + el.connectedData.objectTypeArray[finalObjectId].objectArray.length + "_";
		 el.connectedData.objectTypeArray[finalObjectId].objectDroppedCount++;

         var objectId = el.connectedData.objectTypeArray[finalObjectId].objectArray.length;
         el.connectedData.objectTypeArray[finalObjectId].objectArray.push({
             id: objectId,
             //idExternal : idExternal, /*No longer required in case of mongo*/
             name: draggedDomId,
             currentObjectDomId:currentObjectDomId,
             inputObjectTypeObjectArray: [],
             outputObjectTypeObjectArray: [],
             properties: "objectTypeProperties",
             domainId: "",
             cellId: "",
             executionStatus: "normal",
             notificationCount: "",
             leftPosition: ui.offset.left-$(workflowEl).offset().left,
             topPosition: ui.offset.top-$(workflowEl).offset().top,
             objectLive: 1,
             shortName: "",
             longName: "",
             editStatus: "N",
             controlFlag: "N"
         });
         el.connectedData.objectTypeArray.splice(el.connectedData.objectTypeArray.length-1,1);
		 if (validation === "") {
            // createObject(currentObjectDomId, finalObjectId, el.connectedData.objectTypeArray[finalObjectId].objectArray.length,ui,el);
         }
		 
		 setTimeout(function() {
			 s.$apply(function() {
				 jp.draggable(jsPlumb.getSelector('#'+ currentObjectDomId));
				 createSourceEndpoint(jp,el.initializationData.objectTypeArray[finalObjectId].maxInputCount,currentObjectDomId,el.initializationData.objectTypeArray[finalObjectId].nodeInputPosition);
				 createTargetEndpoint(jp,el.initializationData.objectTypeArray[finalObjectId].maxOutputCount,currentObjectDomId,el.initializationData.objectTypeArray[finalObjectId].nodeOutputPosition);
				// jp.addEndpoint(jsPlumb.getSelector(".process_box_"+domId+" .dbox"), exampleEndpoint3);
				 
		      });
		 }, 5);
		 updateWorkFlow(s.orchestratorId,s.connectedData);
	}
	function createObject(currentObjectDomId,i,j,u,el){
//		var objectShortNameLabel = "";
//        if (el.connectedData.objectTypeArray[i].objectArray[j] !== undefined) {
//            if (el.connectedData.objectTypeArray[i].objectArray[j].shortName !== undefined && parseInt(el.connectedData.objectTypeArray[i].objectArray[j].objectLive) === 1) {
//                objectShortNameLabel = el.connectedData.objectTypeArray[i].objectArray[j].shortName;
//            }
//        }
        el.connectedData.objectTypeArray[i].objectArray[j]['currentObjectDomId']=currentObjectDomId;
        el.connectedData.objectTypeArray[i].objectArray[j].leftPosition=u.offset.left-$(workflowEl).offset().left;
        el.connectedData.objectTypeArray[i].objectArray[j].topPosition=u.offset.top-$(workflowEl).offset().top;		
	}
	 function createWorkflowElement(u,el,db,de,bl){
		 var imgPath="resources/images/workflow";
		 db[bl]=angular.copy(de); 
		 db[bl]['x']=u.offset.left-$(workflowEl).offset().left;
		 db[bl]['y']=u.offset.top-$(workflowEl).offset().top;		
	 }
	function createSourceEndpoint(jp,outputCount, objectDomId,
			nodePosition){ //outputnode==sourcenode == isTarget true
		
		var nodeXPosition = undefined;
		var nodeYPosition = undefined;
		var connectorXDirection = 0;
		var connectorYDirection = 0;
//		for (var i = 1; i <= outputCount; i++) {
//			if (nodePosition === "LEFT" || nodePosition === "RIGHT") {
//				nodeYPosition = (i / outputCount)
//						- (1 / (outputCount * 2));
//			} else if (nodePosition === "BOTTOM"
//					|| nodePosition === "TOP") {
//				nodeXPosition = (i / outputCount)
//						- (1 / (outputCount * 2));
//			}
			var sourceEndpointSpec = {
					endpoint: "Dot",
					anchors : [ "LeftMiddle"],
					paintStyle:{ 						
						stroke:"#ccc",
						fill:"#ccc",
						radius:4,
						lineWidth:1 
					},
					isSource:false,
					isTarget:true,
					connectorOverlays:[ 
	                   [ "Arrow",{width:12, location:1}]
					],
					
	                scope: 'yellow',
	                connectorStyle:{
						stroke:"rgb(67,83,103)",
						lineWidth:1,
					},
					connectorHoverStyle:{
						lineWidth:1,
						stroke:"yellow",
					},
	                dropOptions: {
	                    tolerance: "touch",
	                    hoverClass: "dropHover",
	                    activeClass: "dragActive"
	                },
	                beforeDetach: function (conn) {
	                    return confirm("Detach connection?");
	                },
	                onMaxConnections: function (info) {
	                    alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
	                }
				}
				jp.addEndpoints($('#'+ objectDomId),
							[ sourceEndpointSpec ]);
				//}
		}
	function createTargetEndpoint(jp,inputCount, objectDomId,
			nodePosition){//target==input		
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
//		for (var i = 1; i <= inputCount; i++) {
//			if (nodePosition === "LEFT" || nodePosition === "RIGHT") {
//				nodeYPosition = (i / inputCount)
//						- (1 / (inputCount * 2));
//			} else if (nodePosition === "BOTTOM"
//					|| nodePosition === "TOP") {
//				nodeXPosition = (i / inputCount)
//						- (1 / (inputCount * 2));
//			}
			var targetEndpointSpec = {
					endpoint: "Dot",
					anchors : [ "RightMiddle" ],
	                paintStyle: { 
	                	stroke:"#ccc",
						fill:"transparent",
						radius:4,
						lineWidth:1 
					},
	                isTarget: false,
	                isSource: true,
	                scope: 'yellow',
	                connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
	                connectorStyle: {
	                    stroke: "#ccc",
	                    strokeWidth: 1
	                },
	                dropOptions: {
	                    tolerance: "touch",
	                    hoverClass: "dropHover",
	                    activeClass: "dragActive"
	                },
	                
	                beforeDetach: function (conn) {
	                    return confirm("Detach connection?");
	                },
	                onMaxConnections: function (info) {
	                    alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
	                }
				}
				jp.addEndpoints($('#'+ objectDomId),
						[ targetEndpointSpec ]);
				//}
		}
    function updateWorkFlow(id,connData) {
       WebService.addData('workflow/edit/updateconnecteddata/updateconnecteddata/'+$rootScope.workflowId,connData).then(function(){
    	  // alert('chk');
       }) 
 
    }
	// Connect objects if values present in connectedData
    function autoConnect(jp,s) {
		console.log("Auto connecting Objects (if required)")
		$(function() {

			// repaint

			// append the objects that are present for a
			// objectType
			setTimeout(function() {
				 s.$apply(function() {
			// check if autoConnect is required
			var autoConnect = false;

			// moving from one wrkflow to another,
			// getConnections() was getting previous
			// connections,because of the same scope(shruti)

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
				// autoconnected with there input/output nodes
				// before connecting remove all dead objects
				// cleanAllDeadObjects();
				for (i = 0; i < s.connectedData.objectTypeArray.length; i++) {
					for (var j = 0; j < s.connectedData.objectTypeArray[i].objectArray.length; j++) {

						// Creating the domid for each object
						objectDomId = s.initializationData.objectTypeArray[i].domId
								+ "_" + i + "_" + j + "_";
						if (true) {
							//createObject(objectDomId, i, j);
							
							// make the box invalid if
							// executionStatus is "I"
							if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "I"
									|| s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "") {}

							// make the box invalid if
							// executionStatus is "V"
							else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "V"
									|| s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "P"
									|| s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "E") {
								
							}

							// show status-error-icon if
							// executionStatus is "E"
							else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "E") {}

							// show status-processed-icon if
							// executionStatus is "P"
							else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "P") {}

							// show status-running-icon if
							// executionStatus is "R"
							else if (s.connectedData.objectTypeArray[i].objectArray[j].executionStatus === "R") {}

							var objectNotificationCount = s.connectedData.objectTypeArray[i].objectArray[j].notificationCount;

							// add notification count if present
							if (objectNotificationCount !== undefined
									&& objectNotificationCount !== ""
									&& objectNotificationCount !== null) {}

							// give color of the box
//							$("#" + objectDomId).css({
//								background : "#E8E8E8"// initializationData.objectTypeArray[i].colorCode
//							});

							// Append Short Name of the object
							// $("#" + objectDomId).append('<div
							// style="text-align: center; color:
							// #FFFFFF;margin-top: 45px;
							// font-size: 0.75em">' +
							// initializationData.objectTypeArray[i].name
							// + '</div>');
							// $("#" + objectDomId).append('<div
							// style="text-align: center; color:
							// #000000;margin-top: 15px;
							// font-size: 0.55em">' +
							// connectedData.objectTypeArray[i].objectArray[j].shortName
							// + '</div>');

							// Make objects draggable
//							if (viewType === undefined
//									|| viewType === ""
//									|| viewType === null) {
								
								
										 jp.draggable(jsPlumb.getSelector('#'+ objectDomId));

						//	}

							// position objects based on the
							// values present inside
							// leftPosition and topPosition
							var leftPositionInPx =s.connectedData.objectTypeArray[i].objectArray[j].leftPosition
									+ "px";
							var topPositionInPx = s.connectedData.objectTypeArray[i].objectArray[j].topPosition
									+ "px";
							

							
							// only increment objectDroppedCount
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
						
									// jp.draggable(jsPlumb.getSelector('#'+ currentObjectDomId +' .dbox'));
									 createSourceEndpoint(jp,s.initializationData.objectTypeArray[i].maxInputCount- inputObjectConnectionLiveCount,objectDomId,s.initializationData.objectTypeArray[i].nodeInputPosition);
									 createTargetEndpoint(jp,s.initializationData.objectTypeArray[i].maxOutputCount - outputObjectConnectionLiveCount,	objectDomId,s.initializationData.objectTypeArray[i].nodeOutputPosition);
									// jp.addEndpoint(jsPlumb.getSelector(".process_box_"+domId+" .dbox"), exampleEndpoint3);
									 
							
						}
					}
				}

				// Make connections based on connectedData
				var sourceObjectDomId = "";
				var targetObjectDomId = "";

	

				// defining sourceEndpointSpec and
				// targetEndpointSpec for connected objects
				function createTargetEndpointSpec(
						removableConnectionState, nodePosition) {
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
							// first two co-ordinates define the
							// postion of the connector, last
							// two co-ordinates define the
							// orientation of the line coming
							// out
							anchor : [ "LeftMiddle" ],
							endpoint : [ "Dot", {
								radius : 1
							} ],
							// isTarget:true,
							detachable : false,
							scope : scope,
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
							// first two co-ordinates define the
							// postion of the connector, last
							// two co-ordinates define the
							// orientation of the line coming
							// out
							anchor : [ "LeftMiddle" ],
							endpoint : [ "Dot", {
								radius : 4
							} ],
							isTarget : true,
							scope : scope,
							//hoverPaintStyle : connectorHoverStyle,
							connectorStyle: {
			                    stroke: "#ccc",
			                    strokeWidth: 1
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
						removableConnectionState, nodePosition) {
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
							// first two co-ordinates define the
							// postion of the connector, last
							// two co-ordinates define the
							// orientation of the line coming
							// out
							anchor : [ "RightMiddle" ],
							endpoint : [ "Dot", {
								radius : 1
							} ],
							// isSource:true,
							detachable : false,
							scope : scope,
							connectorStyle: {
			                    stroke: "#ccc",
			                    strokeWidth: 1
			                }
						}
					} else if (removableConnectionState === 1) {
						sourceEndpointSpec = {
							// first two co-ordinates define the
							// postion of the connector, last
							// two co-ordinates define the
							// orientation of the line coming
							// out
							anchor : [ "RightMiddle" ],
							endpoint : [ "Dot", {
								radius : 4
							} ],
							isSource : true,
							connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
							scope : scope,
							connectorStyle: {
			                    stroke: "#ccc",
			                    strokeWidth: 1
			                },
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
									var targetObjectConnectionLive =s.connectedData.objectTypeArray[sourceObjectTypeId].objectArray[sourceObjectId].outputObjectTypeObjectArray[k].connectionLive;

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
												// Check if the
												// connection
												// should be
												// removable or
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
											// Check if the
											// connection should
											// be removable or
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
				updateWorkFlow(s.orchestratorId,s.connectedData);
			} else {
				updateWorkFlow(s.orchestratorId,s.connectedData);
			}
		})
			 });
		 }, 2000);
	}
	function onConnect(jp,s){
		console.log("Listnes if two objects are getting connected");
		// When connections are made, do required validations and populate the connectedData object
		 
		jp.bind("connection",function(con) {
					console.log("Two objects are getting connected just now");
					// Figuring out the details for source and target based on domIds
					
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
										+ "_"
										+ targetObjectTypeId
										+ "_"
										+ targetObjectId
										+ "_")
								.position().left;
						var targetObjectTopPosition = $(
								"#"
										+ s.initializationData.objectTypeArray[targetObjectTypeId].domId
										+ "_"
										+ targetObjectTypeId
										+ "_"
										+ targetObjectId
										+ "_")
								.position().top;
						pushObjectAndMakeAConnectionInConnectedData(s,jp,con.sourceId,con.targetId,targetObjectLeftPosition,targetObjectTopPosition);
					}
					else {
						// detach
						 console.log(con);
						 var params={force:true}
						 jp.deleteConnection(con.connection,params)
//						 jsPlumb.deleteConnection(con.sourceId,
//						 con.targetId);
						alert('Sorry Connection is not Allowed');

					}
					updateWorkFlow(s.orchestratorId,s.connectedData);
			
		});
	}
	function onDetach(jp,event) {
		console.log("Listnes if two objects are getting disconnected");
		//alert('detach')
		// When connections are removed, do required validations
		// and update the connectedData object
		jp.bind("connectionDetached",function(con) {
							var sourceIds = con.sourceId
									.split("_");
							var targetIds = con.targetId
									.split("_");
							var sourceObjectTypeId = parseInt(sourceIds[1]);
							var sourceObjectId = parseInt(sourceIds[2]);
							var targetObjectTypeId = parseInt(targetIds[1]);
							var targetObjectId = parseInt(targetIds[2]);
							if ((sourceObjectTypeId === 7 || sourceObjectTypeId === 8)
									&& targetObjectTypeId === 9) {
								if (window.event.type === "mouseup") {
									jp
											.connect(con);
									jAlert("Not Allowed",
											"Alert Dialog");
								} else {
									beforeDetach(
											con,
											sourceObjectTypeId,
											sourceObjectId,
											targetObjectTypeId,
											targetObjectId)
								}

							}

							else {
								beforeDetach(con,
										sourceObjectTypeId,
										sourceObjectId,
										targetObjectTypeId,
										targetObjectId);
							}

						})
	}
	function beforeDetach(con, sourceObjectTypeId,	sourceObjectId, targetObjectTypeId, targetObjectId) {			
			console.log("Two objects are getting disconnected just now beforedetach"); 
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
			
			//var workflow = new CCTarget.Workflow.WorkflowView();
			updateWorkFlow($rootScope.connectedData.orchestratorid,$rootScope.connectedData);

	}
		
	function pushObjectAndMakeAConnectionInConnectedData(s,jp,sourceId, targetId, objectLeftPosition,objectTopPosition){
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

//				updateObjectCoOrdinates(sourceObjectTypeId,
//						sourceObjectId);
				// Find value for left and top for sourceObject
				/*
				 * var sourceObjectLeftPosition = $("#" +
				 * initializationData.objectTypeArray[sourceObjectTypeId].domId +
				 * "_" + sourceObjectTypeId + "_" + sourceObjectId +
				 * "_").position().left; var sourceObjectTopPosition =
				 * $("#" +
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
			//	s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].leftPosition = objectLeftPosition;
			//	s.connectedData.objectTypeArray[targetObjectTypeId].objectArray[targetObjectId].topPosition = objectTopPosition;

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
			}
		} else {
			// connection not allowed
		}
	}
	function updateConnectedDataWithProperties(s,diagramType, objectTypeId, ObjectId, domainId,workflowId,sourceId, shortName,  longName, samplingDetails) {

        diagramType = parseInt(diagramType);
        objectTypeId = parseInt(objectTypeId);
        ObjectId = parseInt(ObjectId);

        var currentObjectDomId = s.initializationData.objectTypeArray[objectTypeId].domId + "_" + objectTypeId + "_" + ObjectId + "_";

        if (domainId !== undefined && domainId !== "") {
            s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].domainId = domainId;
            s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].executionStatus = "active";
            s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].shortName = shortName;
            s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].longName = longName;
            s.connectedData.objectTypeArray[objectTypeId].objectArray[ObjectId].cellId=sourceId;
        }
        updateWorkFlow(workflowId,s.connectedData);
	}
	function contextMenus(details) {
		console.log(details);
		currentContext = details;
		$.contextMenu({
			selector : ".dbox",
			callback : function(key, options) {
				if (key === "execute") {
					
				}
				else if (key === "deleteObject") {
					var idSplit = ($(this)
							.attr('id'))
							.split("_");
					var objectTypeId = idSplit[1];
					var objectId = idSplit[2];
					var domainId = $rootScope.connectedData.objectTypeArray[objectTypeId].objectArray[objectId].domainId
					var returnObject = {
						command : key,
						clickedObjectTypeId : objectTypeId,
						clickedObjectId : objectId,
						clickedDomainId : domainId
					}
					removeObject(
									currentContext.deleteObject,
									currentContext.context,
									objectTypeId,
									objectId,
									returnObject)
					// executeFunctionByName(currentContext.deleteObject,
					// currentContext.context,
					// returnObject,
					// currentContext.context)
				}
			},
			items : {
				"singleexecute" : {
					name : "Execute Node",
					icon : "edit",
					disabled : false
				},
				"execute" : {
					name : "Execute Branch",
					icon : "edit",
					disabled : false
				},
				"cut" : {
					name : "Cut",
					icon : "cut",
					disabled : true
				},
				"copy" : {
					name : "Copy",
					icon : "copy",
					disabled : true
				},
				"paste" : {
					name : "Paste",
					icon : "paste",
					disabled : true
				},
				"deleteObject" : {
					name : "Delete",
					icon : "delete",
					disabled : false
				},
				"sep1" : "---------",
				"quit" : {
					name : "Quit",
					icon : "quit",
					disabled : true
				}
			}
		});
	}
	function removeObject(deleteObject, context,
			ObjectTypeIndex, ObjectIndex, returnObject) {
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
			if (allowedStatus === 1) {
				if (ObjectTypeIndex !== "6"
						&& ObjectTypeIndex !== "3") {
					jConfirm('Can you confirm this?',
							'Confirmation Dialog', function(
									result) {
								if (result === true) {
									executeFunctionByName(
											deleteObject,
											context,
											returnObject,
											context)

								}
							})
				} else {

					executeFunctionByName(deleteObject,
							context, returnObject, context)

				}
			}
	}
	return workflowservice;
}