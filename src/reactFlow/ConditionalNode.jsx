import { FormControl, TextareaAutosize, MenuItem } from "@mui/material";
import Select from '@mui/material/Select';
import { memo, useState, useRef, useEffect } from "react";
import Box from '@mui/material/Box';
import { Handle, Position, useReactFlow, useStoreApi } from "reactflow";
import styled from "@emotion/styled";

const NodeWithDropdown = ({ id, data, position }) => {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const [textAreaValue, setTextAreaValue] = useState(data.parameter || ''); // State for TextField value
  useEffect(() => {
    // Set the initial value once the component is mounted
    setTextAreaValue(data.parameter || '');
  }, [data.parameter]);
  const textAreaRef = useRef(null);

  const handleTextAreaChange = (e) => {
    setTextAreaValue(e.target.value);
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === id) {
          node={
            ...node,
            parameter:e.target.value,
            requestBody:null,
            data:{
                ...node.data,
                parameter:e.target.value
            }
          }
        }
        return node;
      })
    );
  };

  const handleChange = (e) => {
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            selectedValue: e.target.value
          }
        }
        return node;
      })
    );
  };

  const lowerHandle = () => {
    if (true) {
      return (<Handle type="source" position={Position.Bottom} id={id} />);
    }
  }

  const upperHandle = () => {
    if (true) {
      return (<Handle type="target" position={Position.Top} id={id} />);
    }
  }

  const leftHandle = () => {
    if (true) {
      return (<Handle type="source" position={Position.Left} id={id} />);
    }
  }

  const rightHandle = () => {
    if (true) {
      return (<Handle type="source" position={Position.Right} id={id} />);
    }
  }

  useEffect(() => {
    // Use ResizeObserver to handle changes to the size of the TextareaAutosize
    const resizeObserver = new ResizeObserver(() => {
      // Update the state only when the resizing is complete
      setTextAreaValue(textAreaRef.current.value);
    });

    // Observe the TextareaAutosize element
    if (textAreaRef.current) {
      resizeObserver.observe(textAreaRef.current);
    }

    // Cleanup the observer when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Box sx={{
      width: "400px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }} className="text-updater-node">
      <FormControl sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <TextareaAutosize
        maxRows={5}
          ref={textAreaRef}
          className="nodrag"
          placeholder="Enter Drools Operation"
          value={textAreaValue}
          onChange={handleTextAreaChange}
          style={{ marginTop: "10px", flexGrow: 1, width: '300px', overflow: 'auto' }}
        />
      </FormControl>
      {lowerHandle()}
      {upperHandle()}
    </Box>
  );
};

export default memo(NodeWithDropdown);
