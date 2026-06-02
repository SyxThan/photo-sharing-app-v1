import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";
import AddPhotoModal from "../AddPhotoModal";
import "./styles.css";

function TopBar({ loggedInUser, onLogout, onPhotoAdded }) {
  const location = useLocation();
  const path = location.pathname;
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  
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

  const handleLogout = () => {
    onLogout();
  };

  const handlePhotoAdded = (newPhoto) => {
    setShowAddPhotoModal(false);
    if (onPhotoAdded) {
      onPhotoAdded(newPhoto);
    }
  };

  return (
    <>
      <header className="topbar-appBar">
        <div className="topbar-toolbar">
          <h1 className="topbar-title">
            Thân Văn Sỹ - B23DCKH101
          </h1>

          <p className="topbar-context">
            {getContextText()}
          </p>

          <div className="topbar-user-section">
            {loggedInUser ? (
              <>
                <button
                  className="topbar-add-photo-btn"
                  onClick={() => setShowAddPhotoModal(true)}
                >
                  Add Photo
                </button>
                <span className="topbar-greeting">
                  Hi {loggedInUser.first_name}
                </span>
                <button 
                  className="topbar-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="topbar-login-prompt">
                Please Login
              </span>
            )}
          </div>
        </div>
      </header>

      <AddPhotoModal
        isOpen={showAddPhotoModal}
        onClose={() => setShowAddPhotoModal(false)}
        onPhotoAdded={handlePhotoAdded}
        userId={loggedInUser?._id}
      />
    </>
  );
}

export default TopBar;