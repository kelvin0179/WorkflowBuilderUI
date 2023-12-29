import React, { useEffect } from 'react';
import { TextField, Button, Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ExecutionPage = () => {
  const isTextFieldDisabled = false; // Set your conditions for disabling the text fields

  useEffect(()=>{
    
  },[]);

  return (
    <Grid container style={{ minHeight: '100vh', padding: 20 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: 20, borderRadius: 15 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Work Order
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Enter Origin"
                  fullWidth
                  variant="outlined"
                  name="origin"
                  disabled={isTextFieldDisabled}
                  InputProps={{
                    style: { borderRadius: 10 }, // Adjust the radius for smooth edges
                  }}
                  // other props...
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
                    style: { borderRadius: 10 }, // Adjust the radius for smooth edges
                  }}
                  // other props...
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="mode-label">Select Mode</InputLabel>
                  <Select
                    labelId="mode-label"
                    label="Select Mode"
                    defaultValue="car"
                    disabled={isTextFieldDisabled}
                  >
                    <MenuItem value="car">Car</MenuItem>
                    <MenuItem value="bike">Bike</MenuItem>
                    <MenuItem value="walk">Walk</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Add more fields as needed */}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 10, marginTop: 10 }} // Added margin-top to the button
              disabled={isTextFieldDisabled}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExecutionPage;
