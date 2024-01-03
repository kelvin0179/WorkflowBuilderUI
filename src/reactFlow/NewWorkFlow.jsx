import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
  StepEdge,
  Panel,
  Controls,
  MiniMap,
  useStoreApi,
} from 'reactflow';
import {useNavigate, useParams} from "react-router-dom"
import 'reactflow/dist/style.css';
import './index.css';
import NodeWithDropdown from './Dropdown';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';

const initialNodes = [
  {
    id: '0',
    type: 'customNode',
    data: { 
        label: 'Node',
        value: ['Start'],
        selectedValue: 'Start',
        disabled: true,
        indexValue: 0
    },
    position: { x: 0, y: 50 },
  },
];


const nodeTypes={
    customNode:NodeWithDropdown
}

let id=1;
const AddNodeOnEdgeDrop = () => {
    const navigate = useNavigate();
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
    const store = useStoreApi();
    const [options,setOptions] = useState([["Start"],["time","cost","capacity","Search For Carriers"],["Send Request by Priority Search","BroadCast Request to All"],["Accept","Reject"],["End"]]);
    const [workflowName, setWorkflowName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const getId = () => {
    return `${id++}`;
  };
  const onConnect = useCallback(
    (params) => {
      // reset the start node on connections
      connectingNodeId.current = null;
      let tempNodes;
      setNodes((nds)=>{
        tempNodes=[...nds];
        return nds;
      })
      console.log(tempNodes)
      setEdges((eds) => {
        const sourceNodeId=params.source,targetNodeId=params.target;
        if(eds.filter(ed => (ed.source===sourceNodeId && ed.target===targetNodeId)).length>0){
            return [...eds];
        }
        const sourceNode=tempNodes.filter(node => node.id===sourceNodeId)[0];
        const targetNode=tempNodes.filter(node => node.id===targetNodeId)[0];
        const sourceNodeIndex=sourceNode.data.indexValue;
        const targetNodeIndex=targetNode.data.indexValue;

        if(sourceNode.data.selectedValue==="Reject" && targetNodeIndex===2 && sourceNodeIndex===3) {
            console.log("here");
            return addEdge(params, eds)
        }
        if(sourceNode.data.selectedValue==="Reject" && targetNodeIndex===4 && sourceNodeIndex===3) {
            console.log("here");
            return addEdge(params, eds)
        }
        return eds;
      });
      console.log(params);
    },
    [],
  );
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/workflow/${workflowId}`);
//         console.log(JSON.stringify(response.data));
        
//         id=(await axios.get(`http://localhost:8080/workflow/getMaxNodeId/${workflowId}`)).data;
//         console.log(id);
//         setEdges((eds)=>{
//           const convertedEdges=response.data.edges;
//           const reverseConvertedEdges = convertedEdges.map((convertedEdge) => ({
//             id: convertedEdge.compositeId.id,
//             source: convertedEdge.source,
//             target: convertedEdge.target,
//           }));
//           return reverseConvertedEdges;
//         });
//         setNodes((nds)=>{
//           const convertedNodes=response.data.nodes;
//           const reverseConvertedNodes = convertedNodes.map((convertedNode) => ({
//             id: convertedNode.compositeId.id,
//             data: {
//               label: convertedNode.label,
//               value: convertedNode.nodeValues,
//               selectedValue: convertedNode.selectedValue,
//               indexValue: convertedNode.indexValue,
//               disabled: convertedNode.disabled,
//             },
//             height: convertedNode.height,
//             width: convertedNode.width,
//             position: {
//               x: convertedNode.x,
//               y: convertedNode.y,
//             },
//             positionAbsolute:{
//               x: convertedNode.x,
//               y: convertedNode.y,
//             },
//             type:"customNode",

//           }));
          
//           return reverseConvertedNodes;
//         });
//       } catch (error) {
//         console.error('Error fetching data:', error.message);
//       }
//     };

//     fetchData();
//   }, []);
  useEffect(() => {
    // Check if there are three nodes with specific selected values
    const hasAcceptNode = nodes.some((node) => node.data.selectedValue === "Accept");
    const hasRejectNode = nodes.some((node) => node.data.selectedValue === "Reject");
    const hasEndNode = nodes.some((node) => node.data.selectedValue === "End");

    // Find the ids of nodes with specific selected values
    const acceptNodeId = nodes.find((node) => node.data.selectedValue === "Accept")?.id;
    const rejectNodeId = nodes.find((node) => node.data.selectedValue === "Reject")?.id;
    const endNodeId = nodes.find((node) => node.data.selectedValue === "End")?.id;

    // Check if there are edges between specific nodes
    const hasAcceptToEndEdge = edges.some(
      (edge) => edge.source === acceptNodeId && edge.target === endNodeId
    );
    const hasRejectToEndEdge = edges.some(
      (edge) => edge.source === rejectNodeId && edge.target === endNodeId
    );

    // Update the save button state
    setIsSaveButtonEnabled(hasAcceptNode && hasRejectNode && hasEndNode && hasAcceptToEndEdge && hasRejectToEndEdge);
  }, [nodes,edges]);
  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSave = () => {
    // Do something with the workflowName, e.g., save it
    console.log('Workflow Name:', workflowName);
    let workflow = {};
    workflow.nodes=[];
    workflow.edges=[];
    workflow.name=workflowName;

    const convertedNodes = nodes.map((node, index) => ({
      label: node.data.label,
      compositeId: { id: node.id },
      nodeValues: node.data.value,
      selectedValue: node.data.selectedValue,
      indexValue: node.data.indexValue,
      disabled: node.data.disabled,
      height: node.height,
      width: node.width,
      x: node.position.x,
      y: node.position.y
    }));
    
    const convertedEdges = edges.flat().map((edge, index) => ({
      compositeId: { id: edge.id },
      source: edge.source,
      target: edge.target
    }));

    workflow.nodes=convertedNodes;
    workflow.edges=convertedEdges;


    console.log(workflow);
    axios.post('http://localhost:8080/workflow/', workflow)
  .then(response => {
    console.log('Success:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
    // Close the modal
    handleClose();
    navigate("/");
  };
  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
  const onRestore = useCallback(()=>{
        console.log(nodes,edges);
        const restoreFlow = async () =>{
            const lastNodeId = nodes[nodes.length - 1].id;
            setNodes((nds)=>{
                if(nds.length===1){
                    return nds;
                }
                const newnds=[...nds];
                newnds.pop();
                return newnds;
            })
            setEdges((eds)=>{
                const neweds=[...eds];
                const newEdges=neweds.filter(ed=>!(ed.source===lastNodeId || ed.target===lastNodeId));
                return newEdges;
            })
        }
        restoreFlow();
        console.log(nodes,edges);
    },[nodes,setNodes,edges,setEdges]);
  // const onSaveClick = async() =>{
  //   let workflow = {};
  //   workflow.nodes=[];
  //   workflow.edges=[];

  //   const convertedNodes = nodes.map((node, index) => ({
  //     label: node.data.label,
  //     compositeId: { id: node.id },
  //     nodeValues: node.data.value,
  //     selectedValue: node.data.selectedValue,
  //     indexValue: node.data.indexValue,
  //     disabled: node.data.disabled,
  //     height: node.height,
  //     width: node.width,
  //     x: node.position.x,
  //     y: node.position.y
  //   }));
    
  //   const convertedEdges = edges.flat().map((edge, index) => ({
  //     compositeId: { id: edge.id },
  //     source: edge.source,
  //     target: edge.target
  //   }));

  //   workflow.nodes=convertedNodes;
  //   workflow.edges=convertedEdges;

  //   if(workflowId!==null){
  //     workflow.id=workflowId;
  //   }

  //   console.log(workflow);
  //   axios.post('http://localhost:8080/workflow/', workflow)
  // .then(response => {
  //   console.log('Success:', response.data);
  // })
  // .catch(error => {
  //   console.error('Error:', error.message);
  // });
  // }
  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const newNode = {
          id,
          type:'customNode',
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: {
            label: `Node ${id}`,
            value:[],
            selectedValue: '',
            disabled:false,
            indexValue: 0
        },
          origin: [0.5, 0.0],
        };
        console.log(newNode)
        // setNodes((nds) => {
        //     let newNodes=[...nds];
        //     newNodes=nds.concat(newNode);
        //     return newNodes;
        // });
        let sourceNodeId=connectingNodeId.current,sourceNode,nodeAccept=false,tempEdges;
        setEdges((eds) =>{
            let newEdges=[...eds];
            newEdges=eds.concat({ id, source: connectingNodeId.current, target: id });
            tempEdges=[...newEdges];
            return newEdges;
        });
        // setNodes((nds) =>{
        //     let newNodes=[...nds];
        //     newNodes.push(newNode);
        //     return newNodes;
        // });
        let tempNewNodes;
        setNodes((nds) =>{
            let newNodes=[...nds];
            //find Parent node
            sourceNode=newNodes.filter((node)=>node.id===sourceNodeId)[0];
            //find Parent node
            if(sourceNode.data.indexValue===0){
                console.log(tempEdges.filter((edge)=>(edge.source==='0')).length);
                if(tempEdges.filter((edge)=>(edge.source==='0')).length>1){
                    return newNodes;
                }
                else{
                    newNode.data.indexValue = 1;
                    newNode.data.value=options[1].filter((option)=>!(option==="Search For Carriers"));
                    newNode.data.selectedValue=options[1][0];
                }
            }
            else if(sourceNode.data.indexValue===1){
                if(tempEdges.filter((edge)=>(edge.source===sourceNode.id)).length>1){
                    return newNodes;
                }
                if(sourceNode.data.selectedValue==='Search For Carriers'){
                    newNode.data.value=options[2];
                    newNode.data.selectedValue=options[2][0];
                    newNode.data.indexValue=2;
                }
                else{
                    const existingNodeOptions=newNodes.filter((node)=>(node.data.indexValue===sourceNode.data.indexValue)).map(node=>node.data.selectedValue);
                    newNode.data.value=options[1].filter((value)=>!existingNodeOptions.includes(value));
                    newNode.data.selectedValue=newNode.data.value[0];
                    newNode.data.indexValue=1;
                }
            }
            else if(sourceNode.data.indexValue===2) {
                if(tempEdges.filter((edge)=>(edge.source===sourceNode.id)).length>2){
                    return newNodes;
                }
                const existingNodeOptions=newNodes.filter((node)=>(node.data.indexValue===3)).map(node=>node.data.selectedValue);
                newNode.data.value=options[3].filter((value)=>!existingNodeOptions.includes(value));
                newNode.data.selectedValue=newNode.data.value[0];
                newNode.data.indexValue=3;
            }
            else if(sourceNode.data.indexValue===3){
                if(tempEdges.filter((edge)=>(edge.source===sourceNode.id)).length>1){
                    return newNodes;
                }
                const existingNodeOptions=newNodes.filter((node)=>(node.data.indexValue===3)).map(node=>node.data.selectedValue);
                newNode.data.value=options[4].filter((value)=>!existingNodeOptions.includes(value));
                newNode.data.selectedValue=newNode.data.value[0];
                newNode.data.indexValue=4;

                if(newNodes.filter((node)=>(node.data.selectedValue==="End")).length===1 && newNode.data.selectedValue==="End"){
                  return newNodes;
                }
            }
            for(let i=0; i<newNodes.length; i++){
                newNodes[i].data = {
                    ...newNodes[i].data,
                    disabled: true,
                  };
            }
            newNodes.push(newNode);
            nodeAccept=true;
            console.log(newNodes);
            tempNewNodes=[...newNodes];
            console.log(JSON.stringify(tempNewNodes));
            return [...newNodes];
        });
        setEdges((eds) =>{
            let newEdges=[...eds];
            console.log(JSON.stringify(newEdges));
            newEdges.pop();
            if(nodeAccept){
                newEdges=newEdges.concat({ id, source: connectingNodeId.current, target: id });
            }
            return newEdges;
        });

      }
    },
    [screenToFlowPosition],
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper} style={{ width: '100vw', height: '89vh' ,border: '2px solid #000000'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={SmoothStepEdge}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        nodeTypes={nodeTypes}
        fitViewOptions={{ padding: 10 }}
        nodeOrigin={[0.5, 0]}
      >
        <Panel position="top-right">
            <Box className="button-container">
                {/* <Button variant='contained' color='primary' onClick={onSaveClick}>Save</Button> */}
                <Button variant='contained' color='success' onClick={onRestore}>Undo</Button>
                <Button variant="contained" color="primary" onClick={handleClickOpen} disabled={!isSaveButtonEnabled}
                    sx={{ backgroundColor: 'black', color: 'white' ,
                    '&:hover': {
                        backgroundColor: 'green', // Change background color on hover
                        color: 'black', // Change text color on hover
                      },}}
                >
                  Save
                </Button>
            </Box>
        </Panel>
        <Controls/>
        <MiniMap style={{height:120}} zoomable pannable/>
      </ReactFlow>
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Enter Workflow Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Workflow Name"
            type="text"
            fullWidth
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" >
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);
