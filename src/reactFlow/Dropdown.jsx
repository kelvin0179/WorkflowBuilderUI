import { FormControl, InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { memo, useCallback, useState } from "react";
import Box from '@mui/material/Box';
import { Handle, Position, useReactFlow, useStore, useStoreApi } from "reactflow";

const NodeWithDropdown = ({ id, data, position }) => {
  const {setNodes} = useReactFlow();
  const store = useStoreApi();
  const handleChange = (e) => {
    const {nodeInternals}=store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node)=>{
        if(node.id===id){
            node.data={
              ...node.data,
              selectedValue: e.target.value
            }
        }
        return node;
      })
    );
  };
  const lowerHandle=()=>{
    if(true){
      return(<Handle type="source" position={Position.Bottom} id={id} />);
    }
  }
  const upperHandle=()=>{
    if(true){
      return(<Handle type="target" position={Position.Top} id={id} />);
    }
  }
  const calculateDropdownWidth = () => {
    // Adjust the factor based on your preference
    const dropdownWidth = data.selectedValue.length * 8;
    const extraWidth = 20; // Adjust this value based on your preference
    return dropdownWidth + extraWidth > 100 ? dropdownWidth + extraWidth : 100; // Minimum width of 100px
  };
  return (
    <Box sx={{width: calculateDropdownWidth(),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',}} className="text-updater-node">
      <FormControl sx={{alignContent:"center",justifyContent:"center"}}>
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
          }}}
          style={{padding:"2px",backgroundColor:"#FFFFFF",minWidth:100}}
        >
          {data.value.map((val,indx)=>(
            <MenuItem value={val} key={indx}>{val}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {lowerHandle()}
      {upperHandle()}
    </Box>
  );
  };

  export default memo(NodeWithDropdown);