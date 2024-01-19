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
import ApiNode from './ApiNode';
import ConditionalNode from './ConditionalNode';
import FilterNode from './FilterNode';
import OperationNode from './OperationNode';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialNodes = [
  {
    id: '0',
    type: 'api',
    data: { 
        label: 'Node',
        value: ['GET','POST'],
        selectedValue: 'GET',
        disabled: true,
        indexValue: 0,
    },
    nodeType:"api",
    apiType:"GET",
    requestBody:null,
    position: { x: 0, y: 50 },
  },
];


const nodeTypes={
    customNode:NodeWithDropdown,
    api:ApiNode,
    filter:FilterNode,
    conditional:ConditionalNode,
    operation:OperationNode
}

let id=1;
const AddNodeOnEdgeDrop = () => {
    const {workflowId}=useParams();
    const navigate = useNavigate();
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
    const store = useStoreApi();
    const [nodeType, setNodeType] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openEdgeModal, setOpenEdgeModal] = useState(false);
  const [edgeValue, setEdgeValue] = useState(1);
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName,setWorkflowName] = useState('');
  const { screenToFlowPosition } = useReactFlow();
  const [openWorkFlowModal,setOpenWorkflowModal] = useState(false);
  const getId = () => {
    return `${id++}`;
  };
  useEffect(() => {
    // Fetch workflow data from the server
    axios.get(`http://localhost:8080/workflowData/${workflowId}`)
      .then(response => {
        const { nodes, edges } = response.data; // Assuming the response has nodes and edges properties
        setNodes(nodes);
        setEdges(edges);
      })
      .catch(error => {
        console.error("Error fetching workflow data:", error);
      });
      axios.get(`http://localhost:8080/getMaxNodeId/${workflowId}`)
        .then((response) => {
            id=response.data;
            console.log(id);
        })
        .catch((error) => {
            console.error("Error fetching workflow data:", error);
        });
  }, [workflowId]);
  const onConnect = useCallback(
    (params) => {
      // reset the start node on connections
      connectingNodeId.current = null;
      setEdges((eds) => addEdge(params, eds))
    },
    [],
  );
  
  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setNodes(nds=>{
        let nodesArray=[...nds];
        nodesArray[nodesArray.length-1]={
            ...nodesArray[nodesArray.length-1],
            type:nodeType,
            nodeType:nodeType
        }
        return nodesArray;
    })
    setOpenModal(false);

    const sourceNode=edges[edges.length-1].source;
    if(nodes.filter(node=>node.id===sourceNode)[0].nodeType === 'conditional'){
        setOpenEdgeModal(true);
    }
    setNodeType('');

  };
  const handleWorkflowOpen=()=>{
    setOpenWorkflowModal(true);
  }
  const handleWorkflowClose=()=>{
    setOpenWorkflowModal(false);
  }
  const handleEdgeModalOpen=()=>{
    setOpenEdgeModal(true);
  };
  const handleEdgeModalClose=()=>{
    setEdges(eds=>{
        let newEds=[...eds];
        newEds[newEds.length-1] = {
            ...newEds[newEds.length-1],
            path:edgeValue,
            label:(edgeValue===1)?"True":"False"
        }
        return newEds;
    })
    setOpenEdgeModal(false);
  }
  const handleSubmitGraph = () =>{
    let object={};
    object.startNodeId='0';
    object.nodes=[];
    object.name=workflowName;
    object.edges=[];
    object.nodes=[...nodes];
    object.edges=[...edges];
    console.log(object);
    axios.post(`http://localhost:8080/saveGraph/${workflowId}`,object)
        .then((response) =>{
            console.log(response.data);
        })
        .catch((error) =>{
            console.log(error);
        })
    handleWorkflowClose();
  }
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
          parameter:'',
          requestBody:null,
          apiType:'',
          nodeType:'',
          data: {
            label: `Node ${id}`,
            value:[],
            selectedValue: '',
            disabled:false,
            indexValue: 0
        },
          origin: [0.5, 0.0],
        };
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id }),
        );
        handleClickOpen();
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
                <Button variant="contained" color="primary" onClick={handleWorkflowOpen}
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
        <DialogTitle>Enter NodeType Name</DialogTitle>
        <DialogContent>
            <FormControl sx={{minWidth:"300px"}}>
            <InputLabel id="node-type-select-label">NodeType Name</InputLabel>
            <Select
                labelId="node-type-select-label"
                id="node-type-select"
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
            >
                <MenuItem value="api">API</MenuItem>
                <MenuItem value="filter">Filter</MenuItem>
                <MenuItem value="conditional">Conditional</MenuItem>
                <MenuItem value="operation">Operation</MenuItem>
            </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="secondary">
            Save
            </Button>
        </DialogActions>
        </Dialog>

        <Dialog open={openEdgeModal} onClose={handleEdgeModalClose}>
        <DialogTitle>Enter Edge Value</DialogTitle>
        <DialogContent>
            <FormControl sx={{minWidth:"300px"}}>
            <InputLabel id="edge-value-select-label">Edge Value</InputLabel>
            <Select
                labelId="edge-value-select-label"
                id="edge-value-select"
                value={edgeValue}
                onChange={(e) => setEdgeValue(e.target.value)}
            >
                <MenuItem value={1}>True</MenuItem>
                <MenuItem value={0}>False</MenuItem>
            </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleEdgeModalClose} color="secondary">
            Save
            </Button>
        </DialogActions>
        </Dialog>
        <Dialog open={openWorkFlowModal} onClose={handleWorkflowClose}>
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
          <Button onClick={handleWorkflowClose} color="secondary" >
            Cancel
          </Button>
          <Button onClick={handleSubmitGraph} color="primary">
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
