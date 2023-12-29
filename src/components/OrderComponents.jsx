import React, { useState, useEffect } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';


// Keyframes for check icon animation
const checkAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled components
const OutlinedContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid #ced4da; /* Adjust border color as needed */
  border-radius: 4px;
`;

const TextContainer = styled.div`
  flex: 1;
  text-align: left;
`;

const GreenCheckIcon = styled(CheckIcon)`
  margin-left: 8px;
  animation: ${checkAnimation} 0.5s ease-in-out forwards;
  color: green;
`;

const OrderComponent = () => {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Hide the spinner after 1 second
      setShowSpinner(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <OutlinedContainer>
      {/* Text container with left alignment */}
      <TextContainer>
        Your left-aligned text goes here.
      </TextContainer>

      {/* Conditional rendering based on whether to show the spinner or the check icon */}
      {showSpinner ? (
        <CircularProgress size={24} />
      ) : (
        <GreenCheckIcon />
      )}
    </OutlinedContainer>
  );
};

export default OrderComponent;
