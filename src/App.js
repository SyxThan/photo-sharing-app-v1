import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import LoginRegister from "./components/LoginRegister";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser"))
  );

  const handleLogin = (user, token) => {
    setLoggedInUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8081/admin/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch {}

    localStorage.clear();
    setLoggedInUser(null);
  };

  return (
    <Router>
      <div className="app-root">
        <div className="app-layout">
          <div className="app-topbar">
            <TopBar
              loggedInUser={loggedInUser}
              onLogout={handleLogout}
            />
          </div>

          <div className="main-topbar-buffer" />

          {!loggedInUser ? (
            <div
              className="app-content-column"
              style={{ gridColumn: "1 / -1" }}
            >
              <LoginRegister onLogin={handleLogin} />
            </div>
          ) : (
            <>
              <div className="app-sidebar-column">
                <UserList />
              </div>

              <div className="app-content-column">
                <Routes>
                  <Route
                    path="/users/:userId"
                    element={
                      <ProtectedRoute
                        loggedInUser={loggedInUser}
                        element={<UserDetail />}
                      />
                    }
                  />

                  <Route
                    path="/photos/:userId"
                    element={
                      <ProtectedRoute
                        loggedInUser={loggedInUser}
                        element={<UserPhotos />}
                      />
                    }
                  />

                  <Route
                    path="/comments/:userId"
                    element={
                      <ProtectedRoute
                        loggedInUser={loggedInUser}
                        element={<UserComments />}
                      />
                    }
                  />

                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute
                        loggedInUser={loggedInUser}
                        element={<UserList />}
                      />
                    }
                  />

                  <Route path="/" element={<UserList />} />
                </Routes>
              </div>
            </>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;