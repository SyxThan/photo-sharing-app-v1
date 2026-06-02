import React, { useState } from "react";
import Login from "../Login";
import Register from "../Register";
import "./styles.css";

function LoginRegister({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);

  const handleToggleRegister = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="login-register-container">
      {!showRegister ? (
        <Login onLogin={onLogin} onToggleRegister={handleToggleRegister} />
      ) : (
        <Register onToggleRegister={handleToggleRegister} />
      )}
    </div>
  );
}

export default LoginRegister;