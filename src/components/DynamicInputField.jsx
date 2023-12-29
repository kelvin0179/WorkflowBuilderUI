import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const DynamicInputFields = () => {
  const [inputValues, setInputValues] = useState({});
  const [currentInputId, setCurrentInputId] = useState(1);

  const handleInputChange = (id, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleInputSubmit = () => {
    // Here, you can perform any validation or submission logic.
    // For simplicity, we just increment the input field ID.
    setCurrentInputId((prevId) => prevId + 1);
  };

  return (
    <div>
      {Array.from({ length: currentInputId }, (_, index) => {
        const inputId = index + 1;

        return (
          <div key={inputId} style={{ marginBottom: '16px' }}>
            <TextField
              label={`Input ${inputId}`}
              variant="outlined"
              fullWidth
              value={inputValues[inputId] || ''}
              onChange={(e) => handleInputChange(inputId, e.target.value)}
            />
          </div>
        );
      })}

      <Button variant="contained" color="primary" onClick={handleInputSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default DynamicInputFields;
