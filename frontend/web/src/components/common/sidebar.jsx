import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Box, 
  Chip,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import FeedIcon from '@mui/icons-material/DynamicFeed';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import GradeIcon from '@mui/icons-material/Grade';

const NAVBAR_HEIGHT = 64;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    boxSizing: 'border-box',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    top: NAVBAR_HEIGHT, // Start below navbar
    height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, // Adjust height
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: 12,
  padding: theme.spacing(1.2, 2),
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: selected ? '#f0f9ff' : 'transparent',
  border: selected ? '1px solid #0ea5e9' : '1px solid transparent',
  
  '&:hover': {
    backgroundColor: selected ? '#f0f9ff' : '#f8fafc',
    transform: 'translateX(4px)',
    boxShadow: selected 
      ? '0 4px 12px rgba(14, 165, 233, 0.15)' 
      : '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  
  '&.Mui-selected': {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
    '&:hover': {
      backgroundColor: '#f0f9ff',
    },
  },
}));

const tabConfig = {
  teacher: [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
      badge: null
    },
    { 
      key: 'courses', 
      label: 'My Courses', 
      icon: <SchoolIcon />,
      badge: 5,
      children: [
        { key: 'all-courses', label: 'All Courses', icon: <BookIcon /> },
        { key: 'create-course', label: 'Create Course', icon: <SchoolIcon /> },
      ]
    },
    { 
      key: 'students', 
      label: 'Students', 
      icon: <GroupIcon />,
      badge: 24
    },
    { 
      key: 'assignments', 
      label: 'Assignments', 
      icon: <AssignmentIcon />,
      badge: 3
    },
    { 
      key: 'grades', 
      label: 'Grades', 
      icon: <GradeIcon />,
      badge: null
    },
    { 
      key: 'analytics', 
      label: 'Analytics', 
      icon: <BarChartIcon />,
      badge: null
    },
  ],
  student: [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
      badge: null
    },
    { 
      key: 'courses', 
      label: 'My Courses', 
      icon: <SchoolIcon />,
      badge: 3
    },
    { 
      key: 'assignments', 
      label: 'Assignments', 
      icon: <AssignmentIcon />,
      badge: 5
    },
    { 
      key: 'grades', 
      label: 'Grades', 
      icon: <GradeIcon />,
      badge: null
    },
    { 
      key: 'notifications', 
      label: 'Notifications', 
      icon: <FeedIcon />,
      badge: 2
    },
  ],
};

const Sidebar = ({ type = 'student', activeTab = 'dashboard', setActiveTab }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const tabs = tabConfig[type] || [];

  const handleSubmenuToggle = (key) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <StyledDrawer variant="permanent">
      {/* Brand Section */}
      

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {tabs.map((tab) => (
          <React.Fragment key={tab.key}>
            <ListItem disablePadding>
              <StyledListItemButton
                selected={activeTab === tab.key}
                onClick={() => {
                  if (tab.children) {
                    handleSubmenuToggle(tab.key);
                  } else if (setActiveTab) {
                    setActiveTab(tab.key);
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: activeTab === tab.key ? '#0ea5e9' : '#64748b',
                  }}
                >
                  {tab.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={tab.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: activeTab === tab.key ? '#0f172a' : '#374151',
                      fontWeight: activeTab === tab.key ? 600 : 500,
                      fontSize: '0.95rem',
                    }
                  }}
                />
                {tab.badge && (
                  <Chip
                    label={tab.badge}
                    size="small"
                    sx={{
                      bgcolor: '#ef4444',
                      color: '#ffffff',
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      height: 20,
                      minWidth: 20,
                    }}
                  />
                )}
                {tab.children && (
                  <Box sx={{ color: activeTab === tab.key ? '#0ea5e9' : '#64748b' }}>
                    {openSubmenus[tab.key] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </StyledListItemButton>
            </ListItem>
            {tab.children && (
              <Collapse in={openSubmenus[tab.key]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {tab.children.map((child) => (
                    <ListItem key={child.key} disablePadding>
                      <StyledListItemButton
                        selected={activeTab === child.key}
                        onClick={() => setActiveTab && setActiveTab(child.key)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon 
                          sx={{ 
                            minWidth: 32,
                            color: activeTab === child.key ? '#0ea5e9' : '#94a3b8',
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={child.label}
                          sx={{
                            '& .MuiListItemText-primary': {
                              color: activeTab === child.key ? '#0f172a' : '#64748b',
                              fontSize: '0.875rem',
                              fontWeight: activeTab === child.key ? 500 : 400,
                            }
                          }}
                        />
                      </StyledListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        <Typography 
          variant="caption" 
          color="#94a3b8" 
          align="center" 
          display="block" 
          sx={{ fontSize: '0.75rem' }}
        >
          &copy; {new Date().getFullYear()} LevelUp LMS
        </Typography>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;