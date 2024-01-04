import React, { useEffect, useState } from 'react';
import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, Paper, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkOrderDashboard = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/workorders');
        setWorkOrders(response.data);
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }
    };

    fetchWorkOrders();
  }, []);

  const handleViewClick = (id) => {
    navigate(`/${id}`);
  };

  const getStatusButtonStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return { color: 'green', borderColor: 'green' };
      case 'Rejected':
        return { color: 'red', borderColor: 'red' };
      case 'Pending':
        return { color: 'orange', borderColor: 'orange' };
      default:
        return {};
    }
  };

  return (
    <Container maxWidth="xl" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Workorder Dashboard
      </Typography>
      {workOrders.length === 0 && (
        <Typography variant="h5" gutterBottom style={{ padding: '10px' }}>
        No WorkOrder Records
      </Typography>
      )}
      <TableContainer component={Paper} elevation={5} sx={{ borderRadius: '15px', overflow: 'hidden', opacity: workOrders.length ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
        <Table>
          <TableHead >
            <TableRow>
              <TableCell style={{ backgroundColor: 'black', color: "white" }}>Sequence No.</TableCell>
              <TableCell style={{ backgroundColor: 'black', color: "white" }}>WorkorderId</TableCell>
              <TableCell style={{ backgroundColor: 'black', color: "white" }}>Origin</TableCell>
              <TableCell style={{ backgroundColor: 'black', color: "white" }}>Destination</TableCell>
              <TableCell style={{ backgroundColor: 'black', color: "white" }}>Status</TableCell>
              <TableCell style={{ backgroundColor: 'black', color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workOrders.map((workOrder, index) => (
              <TableRow key={workOrder.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{workOrder.id}</TableCell>
                <TableCell>{workOrder.origin}</TableCell>
                <TableCell>{workOrder.destination}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    style={getStatusButtonStyle(workOrder.status)}
                  >
                    {workOrder.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewClick(workOrder.id)}
                    sx={{
                      backgroundColor: 'black', color: 'white',
                      '&:hover': {
                        backgroundColor: 'green', // Change background color on hover
                        color: 'black', // Change text color on hover
                      },
                    }}
                  >
                    View
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

export default WorkOrderDashboard;
