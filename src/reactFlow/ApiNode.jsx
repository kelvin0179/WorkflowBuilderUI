import { FormControl, InputLabel, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { memo, useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Handle,
  Position,
  useReactFlow,
  useStore,
  useStoreApi,
} from "reactflow";

const NodeWithDropdown = ({ id, data,position }) => {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  
  const [textFieldValue, setTextFieldValue] = useState(data.parameter || ''); // State for TextField value
  useEffect(() => {
    // Set the initial value once the component is mounted
    setTextFieldValue(data.parameter || '');

  }, [data.parameter]);
  
   
  const handleTextFieldChange = (e) => {
    setTextFieldValue(e.target.value);

    // If you need to update the store state, you can do it here
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
            selectedValue: e.target.value,
          };
          node={
            ...node,
            apiType: e.target.value,
          }
        }
        return node;
      })
    );
  };

  const lowerHandle = () => {
    if (true) {
      return <Handle type="source" position={Position.Bottom} id={id} />;
    }
  };
  const upperHandle = () => {
    if (true) {
      return <Handle type="target" position={Position.Top} id={id} />;
    }
  };
  const calculateDropdownWidth = () => {
    // Adjust the factor based on your preference
    const dropdownWidth = data.selectedValue.length * 8;
    const extraWidth = 20; // Adjust this value based on your preference
    return dropdownWidth + extraWidth > 100
      ? dropdownWidth + extraWidth
      : 100; // Minimum width of 100px
  };
  return (
    <Box
      sx={{
        width: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      className="text-updater-node"
    >
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "row", // Make it a row instead of a column
          alignItems: "center", // Align items in the center horizontally
          justifyContent: "center",
        }}
      >
        <InputLabel id="demo-simple-select-label">Process</InputLabel>
        <Select
          disabled={data.disabled}
          className="nodrag"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.selectedValue}
          label="Process"
          onChange={handleChange}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#000000",
            },
          }}
          style={{
            padding: "2px",
            backgroundColor: "#FFFFFF",
            minWidth: 100,
            marginRight: "10px",
          }}
        >
          <MenuItem value="GET" >
              GET
            </MenuItem>
            <MenuItem value="POST" >
              POST
            </MenuItem>
        </Select>
        <TextField
          className="nodrag"
          label="Enter API"
          variant="standard"
          value={textFieldValue}
          onChange={handleTextFieldChange}
          style={{ marginTop: "10px", flexGrow: 1, width: "500px" }}
        />
      </FormControl>
      {lowerHandle()}
      {upperHandle()}
    </Box>
  );
};

export default memo(NodeWithDropdown);
