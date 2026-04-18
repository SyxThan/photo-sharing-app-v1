import './App.css';

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

const App = (props) => {
  return (
      <Router>
        <div className="app-root">
          <div className="app-layout">
            <div className="app-topbar">
              <TopBar />
            </div>
            <div className="main-topbar-buffer" />
            <div className="app-sidebar-column">
              <div className="main-grid-item">
                <UserList />
              </div>
            </div>
            <div className="app-content-column">
              <div className="main-grid-item">
                <Routes>
                  <Route
                      path="/users/:userId"
                      element = {<UserDetail />}
                  />
                  <Route
                      path="/photos/:userId"
                      element = {<UserPhotos />}
                  />
                  <Route path="/users" element={<UserList />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Router>
  );
}

export default App;
