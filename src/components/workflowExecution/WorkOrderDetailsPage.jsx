import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Alert,
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, [workOrderId]);

  return (
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
    </Grid>
  );
};

export default WorkOrderDetailsPage;
