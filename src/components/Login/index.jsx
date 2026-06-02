import React, { useState } from "react";
import "./styles.css";

function Login({ onLogin, onToggleRegister }) {
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginName || !loginPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: loginName,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại");
        return;
      }

      onLogin(data.user, data.token);
    } catch (err) {
      setError("Không thể kết nối đến server");
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-title">Đăng Nhập</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit">Đăng Nhập</button>
      </form>

      <p>
        Chưa có tài khoản?
        <button type="button" onClick={onToggleRegister}>
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
}

export default Login;