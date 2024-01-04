import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Container,
} from '@mui/material';
import axios from 'axios';
import { redirect } from 'react-router-dom';

const CarrierPage = () => {
  const [carrierData, setCarrierData] = useState([]);

  useEffect(() => {
    // Fetch carrier data from the backend
    axios.get('http://localhost:8080/api/carriers/carrierPage')
      .then((response) => {
        // Add 'status' field with value 'Assigned' to each record
        const dataWithStatus = response.data.map((record) => ({
          ...record,
          status: 'Assigned',
        }));
        setCarrierData(dataWithStatus);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAcceptReject = (record, status) => {
    // Update the status for the selected record
    const updatedData = carrierData.map((data) =>
      data.carrierId === record.carrierId ? { ...data, status } : data
    );
    setCarrierData(updatedData);

    // Perform the API call to update the status
    axios.post('http://localhost:8080/api/request/carrier', {
      carriersId: record.carrierId,
      workOrderId: record.workOrderId,
      workflowId: record.workflowId,
      status,
    })
    .then((response) => {
      // Handle success, if needed
      console.log('Status updated successfully:', response.data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error updating status:', error);
    });
  };

  return (
        <Container maxWidth="xl" style={{padding:"20px"}}>

        <Typography variant="h5" gutterBottom style={{ padding: '10px' }}>
        Carriers Request Table
      </Typography>
      {carrierData.length === 0 && (
        <Typography variant="h5" gutterBottom style={{ padding: '10px' }}>
        No Carrier Records
      </Typography>
      )}
      <TableContainer component={Paper} elevation={5} sx={{ borderRadius: '15px', overflow: 'hidden',opacity: carrierData.length ? 1 : 0,transition: 'opacity 0.5s ease-in-out' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white', background: 'black' }}>Sequence No</TableCell>
              <TableCell style={{ color: 'white', background: 'black' }}>Origin</TableCell>
              <TableCell style={{ color: 'white', background: 'black' }}>Destination</TableCell>
              <TableCell style={{ color: 'white', background: 'black' }}>Workflow Name</TableCell>
              <TableCell style={{ color: 'white', background: 'black' }}>Truck ID</TableCell>
              <TableCell style={{ color: 'white', background: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carrierData
              .filter((record) => record.status === 'Assigned')
              .map((record, index) => (
                <TableRow
                  key={record.carrierId}
                  sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f2f2f2' }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.origin}</TableCell>
                  <TableCell>{record.destination}</TableCell>
                  <TableCell>{record.workflowName}</TableCell>
                  <TableCell>{record.truckId}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAcceptReject(record, 'Accepted')}
                      sx={{ marginRight: '8px' }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleAcceptReject(record, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
        </Container>
      
  );
};

export default CarrierPage;
