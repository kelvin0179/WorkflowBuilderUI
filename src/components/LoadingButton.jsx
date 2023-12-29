import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';

const AnimatedCheckIcon = styled(CheckIcon)`
  @keyframes checkAnimation {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  animation: checkAnimation 0.5s ease-in-out;
`;

const AnimatedButton = (props) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    // Simulate an asynchronous action (e.g., an API request)
    setLoading(true);
    props.handleSubmit();
    // Simulate a delay, then set the success state
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Reset success state after a short delay (to show the check mark)
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }, 2000);
  };

  const buttonColor = success ? 'success' : 'primary';

  return (
    <>
      {(loading || success) ? (
        <Container
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            borderRadius: '4px',
            padding: '8px !important',
            backgroundColor: '#FFFFFF',
            color: '#4CAF50',
          }}
        >
          {loading && <CircularProgress size={24} style={{ marginRight: 8 }} />} {/* Loading Spinner */}
          {success && <AnimatedCheckIcon style={{ marginRight: 8 }} />} {/* Animated Check Mark */}
          {(!loading && !success) && 'Click me'} {/* Regular Text */}
        </Container>
      ) : (
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            borderRadius: '4px',
            padding: '8px',
            '&:hover': {
              backgroundColor: success ? '#4CAF50' : undefined, // Change hover color for success state
            },
          }}
        >
          {loading && <CircularProgress size={24} style={{ marginRight: 8 }} />} {/* Loading Spinner */}
          {success && <AnimatedCheckIcon style={{ marginRight: 8 }} />} {/* Animated Check Mark */}
          {(!loading && !success) && 'Submit'} {/* Regular Text */}
        </Button>
      )}
    </>
  );
};

export default AnimatedButton;
