import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Container,
} from '@mui/material';
import axios from 'axios';

const WorkOrderDetailsPage = () => {
  const { workOrderId } = useParams();
  const [workOrderDetails, setWorkOrderDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/request/workOrderIdPageData/${workOrderId}`)
      .then((response) => {
        setWorkOrderDetails(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [workOrderId]);

  return (
    <Container maxWidth="xl" style={{padding:"20px"}}>
    <Grid container style={{ minHeight: '100vh', padding: 20 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20, borderRadius: 15 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Work Order Details
          </Typography>
          {workOrderDetails ? (
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Origin"
                    fullWidth
                    variant="outlined"
                    name="origin"
                    disabled
                    defaultValue={workOrderDetails.origin}
                    InputProps={{
                      style: { borderRadius: 10 },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Destination"
                    fullWidth
                    variant="outlined"
                    name="destination"
                    disabled
                    defaultValue={workOrderDetails.destination}
                    InputProps={{
                      style: { borderRadius: 10 },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="workflow-label">Workflow Name</InputLabel>
                    <Select
                      labelId="workflow-label"
                      label="Workflow Name"
                      disabled
                      defaultValue={workOrderDetails.workflowName}
                    >
                      <MenuItem value={workOrderDetails.workflowName}>
                        {workOrderDetails.workflowName}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Display cost, time, capacity conditionally */}
                {workOrderDetails.cost !== null && (
                  <Grid item xs={12}>
                    <TextField
                      label="Cost"
                      fullWidth
                      variant="outlined"
                      name="cost"
                      disabled
                      defaultValue={workOrderDetails.cost}
                      InputProps={{
                        style: { borderRadius: 10 },
                      }}
                    />
                  </Grid>
                )}

                {workOrderDetails.time !== null && (
                  <Grid item xs={12}>
                    <TextField
                      label="Time"
                      fullWidth
                      variant="outlined"
                      name="time"
                      disabled
                      defaultValue={workOrderDetails.time}
                      InputProps={{
                        style: { borderRadius: 10 },
                      }}
                    />
                  </Grid>
                )}

                {workOrderDetails.capacity !== null && (
                  <Grid item xs={12}>
                    <TextField
                      label="Capacity"
                      fullWidth
                      variant="outlined"
                      name="capacity"
                      disabled
                      defaultValue={workOrderDetails.capacity}
                      InputProps={{
                        style: { borderRadius: 10 },
                      }}
                    />
                  </Grid>
                )}
                {workOrderDetails.loadType !== null && (
                  <Grid item xs={12}>
                    <TextField
                      label="LoadType"
                      fullWidth
                      variant="outlined"
                      name="loadType"
                      disabled
                      defaultValue={workOrderDetails.loadType}
                      InputProps={{
                        style: { borderRadius: 10 },
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  {/* Display Alert based on status */}
                  <Alert
                    severity={
                      workOrderDetails.status === 'Pending'
                        ? 'warning'
                        : workOrderDetails.status === 'Accepted'
                        ? 'success'
                        : 'error'
                    }
                  >
                    {workOrderDetails.status}
                  </Alert>
                </Grid>
              </Grid>
            </form>
          ) : (
            <Typography variant="body1" align="center">
              Loading...
            </Typography>
          )}
        </Paper>
      </Grid>
      {/* Table for Carriers */}
      <Grid item xs={12} sm={8} md={6} lg={8}>
  <Typography variant="h5" align="center" gutterBottom>
    Carriers Associated
  </Typography>
  {workOrderDetails && workOrderDetails.carriers ? (
    <TableContainer
      component={Paper}
      elevation={5}
      sx={{ borderRadius: '15px', overflow: 'hidden', marginLeft: '20px' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'white', background: 'black' }}>Carrier ID</TableCell>
            <TableCell style={{ color: 'white', background: 'black' }}>Truck ID</TableCell>
            {workOrderDetails.cost !== null && (
              <TableCell style={{ color: 'white', background: 'black' }}>Cost</TableCell>
            )}
            {workOrderDetails.time !== null && (
              <TableCell style={{ color: 'white', background: 'black' }}>Time</TableCell>
            )}
            {workOrderDetails.capacity !== null && (
              <TableCell style={{ color: 'white', background: 'black' }}>Capacity</TableCell>
            )}
            {workOrderDetails.loadType !== null && (
              <TableCell style={{ color: 'white', background: 'black' }}>LoadType</TableCell>
            )}
            <TableCell style={{ color: 'white', background: 'black' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workOrderDetails.carriers.map((carrier) => (
            <TableRow key={carrier.carrierId}>
              <TableCell>{carrier.carrierId}</TableCell>
              <TableCell>{carrier.truckId}</TableCell>
              {workOrderDetails.cost !== null && <TableCell>{carrier.cost}</TableCell>}
              {workOrderDetails.time !== null && <TableCell>{carrier.time}</TableCell>}
              {workOrderDetails.capacity !== null && <TableCell>{carrier.capacity}</TableCell>}
              {workOrderDetails.loadType !== null && <TableCell>{carrier.loadType}</TableCell>}
              <TableCell>
                {carrier.status === 'Rejected' ? (
                  <Button variant="outlined" color="error">
                    {carrier.status}
                  </Button>
                ) : carrier.status === 'Accepted' ? (
                  <Button variant="outlined" color="success">
                    {carrier.status}
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary">
                    {carrier.status}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography variant="body1" align="center">
      Loading Carriers...
    </Typography>
  )}
</Grid>

    </Grid>
    </Container>
  );
};

export default WorkOrderDetailsPage;
