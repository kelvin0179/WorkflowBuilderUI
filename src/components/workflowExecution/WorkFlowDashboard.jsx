import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const WorkFlowDashboard = () => {
    const [workflows, setWorkflows] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get('http://localhost:8080/workflowData');
        setWorkflows(response.data);
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }
    };

    fetchWorkflows();
  }, []);
  const handleViewClick = (id) => {
    navigate(`/graph/${id}`);
  };
  return (
    <Container maxWidth="xl" style={{padding:"20px"}}>
      <Typography variant="h4" gutterBottom>
        Workflow Dashboard
      </Typography>
      {workflows.length === 0 && (
        <Typography variant="h5" gutterBottom style={{ padding: '10px' }}>
        No Workflow Records
      </Typography>
      )}
      <TableContainer component={Paper} elevation={5} sx={{ borderRadius: '15px', overflow: 'hidden' ,opacity: workflows.length ? 1 : 0,transition: 'opacity 0.5s ease-in-out'}}>
        <Table>
          <TableHead >
            <TableRow>
              <TableCell style={{ backgroundColor: 'black' , color:"white"}}>Sequence No.</TableCell>
              <TableCell style={{ backgroundColor: 'black' , color:"white"}}>WorkflowId</TableCell>
              <TableCell style={{ backgroundColor: 'black' , color:"white"}}>WorkflowName</TableCell>
              <TableCell style={{ backgroundColor: 'black' , color:"white"}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.map((workflow, index) => (
              <TableRow key={workflow.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{workflow.id}</TableCell>
                <TableCell>{workflow.name}</TableCell>
                <TableCell>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewClick(workflow.id)}
                    sx={{ backgroundColor: 'black', color: 'white' ,
                    '&:hover': {
                        backgroundColor: 'green', // Change background color on hover
                        color: 'black', // Change text color on hover
                      },}}
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
  )
}

export default WorkFlowDashboard