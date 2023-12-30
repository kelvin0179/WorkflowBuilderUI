import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExecutionPage = () => {
  const [isTextFieldDisabled, setIsTextFieldDisabled] = useState(false);
  const [workflowData, setWorkflowData] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/request/workOrderPageData')
      .then((response) => {
        setWorkflowData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleWorkOrderChange = (event) => {
    const selectedOrder = workflowData.find(
      (order) => order.name === event.target.value
    );
    setSelectedWorkOrder(selectedOrder);
    setSelectedWorkOrderId(selectedOrder ? selectedOrder.id : null);
  };

  const renderDynamicFields = () => {
    if (!selectedWorkOrder) return null;

    return selectedWorkOrder.nodeValues.map((nodeValue, index) => (
      <Grid item xs={12} key={index}>
        <TextField
          label={nodeValue}
          fullWidth
          variant="outlined"
          name={`nodeValue_${index}`}
          disabled={isTextFieldDisabled}
          InputProps={{
            style: { borderRadius: 10 },
          }}
        />
      </Grid>
    ));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic for handling form submission
    // Access the values from the input fields
  const originValue = event.target.elements.origin.value;
  const destinationValue = event.target.elements.destination.value;

  // Access the selected value from the dropdown
  const selectedMode = selectedWorkOrder ? selectedWorkOrder.name : '';
  const selectedModeId = selectedWorkOrderId;
  // Access additional values from the dynamic input fields
  console.log(selectedWorkOrder);
  const dynamicFieldValues = selectedWorkOrder
    ? selectedWorkOrder.nodeValues.map((nodeValue, index) => ({
        nodeValue,
        dynamicValue: event.target.elements[`nodeValue_${index}`].value,
      }))
    : [];

    const dynamicFieldJson = dynamicFieldValues.reduce((acc, { nodeValue, dynamicValue }) => {
      acc[nodeValue] = dynamicValue;
      return acc;
    }, {});

  // Do something with the values, for example, log them
  console.log('Origin:', originValue);
  console.log('Destination:', destinationValue);
  console.log('Selected Mode:', selectedMode);
  console.log('Selected Mode ID:', selectedModeId);
  console.log('Dynamic Field Values:', dynamicFieldValues);
  
  dynamicFieldJson.origin=originValue;
  dynamicFieldJson.destination=destinationValue;
  dynamicFieldJson.workflowId=selectedModeId;

  console.log('Dynamic Field JSON:', dynamicFieldJson);
    axios.post("http://localhost:8080/api/request",dynamicFieldJson)
    .then((response) => {
      let data={};
      data.workOrderData=response.data;
      data.dynamicFieldJson=dynamicFieldJson;
      navigate("",{data:data});
      })
    .catch((error) =>{
      console.log(error);
    });
  };

  return (
    <Grid container style={{ minHeight: '100vh', padding: 20 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20, borderRadius: 15 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Work Order
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Enter Origin"
                  fullWidth
                  variant="outlined"
                  name="origin"
                  disabled={isTextFieldDisabled}
                  InputProps={{
                    style: { borderRadius: 10 },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Enter Destination"
                  fullWidth
                  variant="outlined"
                  name="destination"
                  disabled={isTextFieldDisabled}
                  InputProps={{
                    style: { borderRadius: 10 },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="workOrder-label">Select Work Flow</InputLabel>
                  <Select
                    labelId="workOrder-label"
                    label="Select Work Order"
                    onChange={handleWorkOrderChange}
                    defaultValue=""
                    disabled={isTextFieldDisabled}
                  >
                    <MenuItem value="" disabled>
                      Select an option
                    </MenuItem>
                    {workflowData.map((workOrder) => (
                      <MenuItem key={workOrder.id} value={workOrder.name}>
                        {workOrder.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {renderDynamicFields()}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ borderRadius: 10, marginTop: 10 }}
                  disabled={isTextFieldDisabled}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExecutionPage;
