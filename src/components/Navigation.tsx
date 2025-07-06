import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from '@mui/material';
import { Home, History, Map, Settings } from '@mui/icons-material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        background: theme.palette.mode === 'dark' 
          ? 'rgba(30, 30, 30, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        transition: theme.transitions.create(['background-color', 'border-color']),
      }} 
      elevation={3}
    >
      <BottomNavigation 
        value={value} 
        onChange={handleChange}
        sx={{
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="Map"
          value="/map"
          icon={<Map />}
        />
        <BottomNavigationAction
          label="History"
          value="/history"
          icon={<History />}
        />
        <BottomNavigationAction
          label="Settings"
          value="/settings"
          icon={<Settings />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation; 