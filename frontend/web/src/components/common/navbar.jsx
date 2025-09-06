import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Logout,
  Person
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProfileModal from '../student/ProfileModal';
import MyAccountModal from '../student/MyAccountModal';
import LogoutModal from '../student/LogoutModal';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
}));

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: '#f1f5f9',
  border: '1px solid #e2e8f0',
  '&:hover': {
    backgroundColor: '#e2e8f0',
    borderColor: '#0077B6',
  },
  '&:focus-within': {
    backgroundColor: '#ffffff',
    borderColor: '#0077B6',
    boxShadow: '0 0 0 3px rgba(0, 119, 182, 0.1)',
  },
  marginLeft: 0,
  width: '100%',
  maxWidth: '400px',
  transition: 'all 0.2s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1e293b',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    '&::placeholder': {
      color: '#64748b',
    },
  },
}));

const Navbar = ({ userType = 'student', userName = 'User' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    handleMenuClose();
  };

  const handleAccountClick = () => {
    setAccountModalOpen(true);
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
    handleMenuClose();
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <StyledAppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(0, 119, 182, 0.3)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="#ffffff">
                L
              </Typography>
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '1.5rem',
              }}
            >
              LevelUp LMS
            </Typography>
          </Box>
        </Box>

        {/* Search Section */}
        <SearchBox>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search courses, assignments..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchBox>

        {/* Actions Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  color: '#0077B6',
                },
              }}
            >
              <Badge
                badgeContent={3}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton
              size="large"
              color="inherit"
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  color: '#0077B6',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 1 }}>
              <Typography variant="body2" color="#1e293b" fontWeight={500}>
                {userName}
              </Typography>
              <Typography variant="caption" color="#64748b">
                {userType.charAt(0).toUpperCase() + userType.slice(1)}
              </Typography>
            </Box>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                  }}
                >
                  {getInitials(userName)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: 2,
              minWidth: 200,
              border: '1px solid #e2e8f0',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <Avatar sx={{ bgcolor: '#0077B6' }}>
              <Person />
            </Avatar>
            Profile
          </MenuItem>
          <MenuItem onClick={handleAccountClick}>
            <Avatar sx={{ bgcolor: '#00B4D8' }}>
              <AccountCircle />
            </Avatar>
            My Account
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <Avatar sx={{ bgcolor: '#64748b' }}>
              <Logout />
            </Avatar>
            Logout
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: 2,
              minWidth: 300,
              maxHeight: 400,
              border: '1px solid #e2e8f0',
            },
          }}
        >
          <MenuItem>
            <Typography variant="body2">New assignment posted in Mathematics</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">Grade updated for Physics Quiz</Typography>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2">New course material available</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Modals */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <MyAccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
    </StyledAppBar>
  );
};

export default Navbar;