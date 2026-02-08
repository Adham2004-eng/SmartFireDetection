import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import NotificationMenu from './NotificationMenu';

interface TopBarProps {
  drawerWidth: number;
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ drawerWidth, onMenuClick }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Smart Fire Fighting System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationMenu />
          <Chip
            label="LIVE"
            color="success"
            size="small"
            sx={{
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 },
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

