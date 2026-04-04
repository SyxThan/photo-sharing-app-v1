import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const path = location.pathname;
  
  const getContextText = () => {
    if (path.includes("/users/")) {
      const userId = path.split("/")[2]; 
      const user = models.userModel(userId);
      return user ? `${user.first_name} ${user.last_name}` : "";
    }
    if (path.includes("/photos/")) {
      const userId = path.split("/")[2];
      const user = models.userModel(userId);
      return user ? `Photos of ${user.first_name} ${user.last_name}` : "";
    }

    return ""; 
  };


  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
      
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Thân Văn Sỹ - B23DCKH101
        </Typography>

        <Typography variant="h5" color="inherit">
          {getContextText()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;