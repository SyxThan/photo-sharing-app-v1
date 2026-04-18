import React from "react";
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
    <header className="topbar-appBar">
      <div className="topbar-toolbar">
        <h1 className="topbar-title">
          Thân Văn Sỹ - B23DCKH101
        </h1>

        <p className="topbar-context">
          {getContextText()}
        </p>
      </div>
    </header>
  );
}

export default TopBar;