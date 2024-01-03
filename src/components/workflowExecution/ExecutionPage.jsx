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
  Container,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExecutionPage = () => {
  const [isTextFieldDisabled, setIsTextFieldDisabled] = useState(false);
  const [allRoutes,setAllRoutes] = useState([]);
  const [uniqueDestinations, setUniqueDestinations] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [workflowData, setWorkflowData] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/request/workOrderPageData')
      .then((response) => {
        setWorkflowData(response.data);
        setAllRoutes(response.data[0].carriers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    if (selectedOrigin) {
      const destinationsForSelectedOrigin = new Set(
        allRoutes
          .filter((carrier) => carrier.origin === selectedOrigin.value)
          .map((carrier) => carrier.destination)
      );
      setUniqueDestinations([...destinationsForSelectedOrigin]);
    }
  }, [selectedOrigin, allRoutes]);
  const handleWorkOrderChange = (event) => {
    const selectedOrder = workflowData.find(
      (order) => order.name === event.target.value
    );
    setSelectedWorkOrder(selectedOrder);
    setSelectedWorkOrderId(selectedOrder ? selectedOrder.id : null);
  };
  const handleOriginChange = (event, newValue) => {
    setSelectedOrigin(newValue);
    setSelectedDestination(null);
  };
  const handleDestinationChange = (event, newValue) => {
    setSelectedDestination(newValue);
  };
  const renderDynamicFields = () => {
    if (!selectedWorkOrder) return null;
  
    return selectedWorkOrder.nodeValues.map((nodeValue, index) => (
      <Grid item xs={12} key={index}>
        {nodeValue === 'loadType' ? (
          <FormControl fullWidth variant="outlined" required={true}>
            <InputLabel>{nodeValue}</InputLabel>
            <Select
              label={nodeValue}
              name={`nodeValue_${index}`}
              disabled={isTextFieldDisabled}
            >
              <MenuItem value="Hazmat">Hazmat</MenuItem>
              <MenuItem value="Perishable">Perishable</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <TextField
            label={nodeValue}
            fullWidth
            required={true}
            variant="outlined"
            name={`nodeValue_${index}`}
            disabled={isTextFieldDisabled}
            InputProps={{
              style: { borderRadius: 10 },
            }}
          />
        )}
      </Grid>
    ));
  };
  

  const handleSubmit = async(event) => {
    event.preventDefault();
    // Add logic for handling form submission
    // Access the values from the input fields
  const originValue = selectedOrigin.value;
  const destinationValue = selectedDestination.value;

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
    await axios.post("http://localhost:8080/api/request",dynamicFieldJson)
    .then((response) => {
      navigate(`/${response.data.id}`);
      })
    .catch((error) =>{
      console.log(error);
    });
  };

  return (
    <Container maxWidth="xl" style={{padding:"20px"}}>
    <Grid container style={{ minHeight: '100vh', padding: 20 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20, borderRadius: 15 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Work Order
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* <TextField
                  label="Enter Origin"
                  fullWidth
                  variant="outlined"
                  name="origin"
                  disabled={isTextFieldDisabled}
                  InputProps={{
                    style: { borderRadius: 10 },
                  }}
                /> */}
                <Autocomplete
                disablePortal
                id="origin-combo-box"
                options={[...new Set(allRoutes.map((carrier) => carrier.origin))].map((origin) => ({
                  label: origin,
                  value: origin,
                }))}
                value={selectedOrigin}
                onChange={handleOriginChange}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                
                renderInput={(params) => (
                  <TextField {...params} label="Origin" required={true} />
                )}
              />

              </Grid>
              <Grid item xs={12}>
              <Autocomplete
                disablePortal
                id="destination-combo-box"
                options={uniqueDestinations.map((destination) => ({
                  label: destination,
                  value: destination,
                }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={handleDestinationChange}
                value={selectedDestination}
                renderInput={(params) => (
                  <TextField {...params} label="Destination" required={true} />
                )}
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
                    required={true}
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
                  style={{ borderRadius: 7, marginTop: 10, }}
                  sx={{ backgroundColor: 'black', color: 'white' ,
                    '&:hover': {
                        backgroundColor: 'green', // Change background color on hover
                        color: 'black', // Change text color on hover
                      },}}
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
    </Container>
  );
};

export default ExecutionPage;
