import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const navigate=useNavigate();
  const location=useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleWorkOrderDashboardClick = () => {
    navigate('/workOrderDash');
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AUTO BUILD
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem
                component={Link}
                to="/graph"
                onClick={handleCloseNavMenu}
              >
                <Typography textAlign="center">Create Flow</Typography>
              </MenuItem>

              <MenuItem
                component={Link}
                to="/"
                onClick={handleCloseNavMenu}
              >
                <Typography textAlign="center">Create Order</Typography>
              </MenuItem>

              <MenuItem
                component={Link}
                to="/workOrderDash"
                onClick={handleCloseNavMenu}
              >
  <Typography textAlign="center">Order Dashboard</Typography>
</MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AUTO BUILD
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
          <Button
          component={Link}
          to="/graph"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  mx :1 ,
                  
                  display: 'block',
                  color: location.pathname === '/graph' ? 'black' : 'white',
                  backgroundColor: location.pathname === '/graph' ? 'green' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'green', // Change background color on hover
                    color: 'black', // Change text color on hover
                  },
                }}
              >
                Create Flow
          </Button>
          <Button
          component={Link}
          to="/"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  mx :1 ,
                  display: 'block',
                  color: location.pathname === '/' ? 'black' : 'white',
                  backgroundColor: location.pathname === '/' ? 'green' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'green', // Change background color on hover
                    color: 'black', // Change text color on hover
                  },
                }}
              >
                Create Order
          </Button>
          {/* <Button
            component={Link}
            to="/workOrderDash"
            onClick={handleCloseNavMenu}
            sx={{
              my: 2,
              mx :1 ,
              display: 'block',
              color: location.pathname === '/workOrderDash' ? 'black' : 'white',
                  backgroundColor: location.pathname === '/workOrderDash' ? 'green' : 'transparent',
              '&:hover': {
                backgroundColor: 'green', // Change background color on hover
                color: 'black', // Change text color on hover
              },
            }}
          >
            Order Dashboard
          </Button> */}
          <Button
            component={Link}
            to="/workflowDash"
            onClick={handleCloseNavMenu}
            sx={{
              my: 2,
              mx :1 ,
              display: 'block',
              color: location.pathname === '/workflowDash' ? 'black' : 'white',
                  backgroundColor: location.pathname === '/workflowDash' ? 'green' : 'transparent',
              '&:hover': {
                backgroundColor: 'green', // Change background color on hover
                color: 'black', // Change text color on hover
              },
            }}
          >
            Flow Dashboard
          </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
          <Button
          component={Link}
          to="/carriers"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  display: 'block',
                  color: location.pathname === '/carriers' ? 'black' : 'white',
                  backgroundColor: location.pathname === '/carriers' ? 'green' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'green', // Change background color on hover
                    color: 'black', // Change text color on hover
                  },
                }}
              >
                Carriers App
          </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
