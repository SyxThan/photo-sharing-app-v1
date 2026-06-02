import React, { useState } from "react";
import "./styles.css";

function Register({ onToggleRegister }) {
  const [form, setForm] = useState({
    loginName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    location: "",
    description: "",
    occupation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.loginName ||
      !form.password ||
      !form.confirmPassword ||
      !form.firstName ||
      !form.lastName
    ) {
      setError("Vui lòng nhập đầy đủ các trường bắt buộc");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không trùng khớp");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:8081/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: form.loginName,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          location: form.location,
          description: form.description,
          occupation: form.occupation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại");
        return;
      }

      setSuccess("Đăng ký thành công!");

      setForm({
        loginName: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch {
      setError("Không thể kết nối đến server");
    }
  };

  return (
    <div className="register-card">
      <h2>Đăng Ký</h2>

      <form onSubmit={handleRegister}>
        <input
          name="loginName"
          placeholder="Tên đăng nhập"
          value={form.loginName}
          onChange={handleChange}
        />

        <input
          name="firstName"
          placeholder="Tên"
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Họ"
          value={form.lastName}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Địa chỉ"
          value={form.location}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="occupation"
          placeholder="Nghề nghiệp"
          value={form.occupation}
          onChange={handleChange}
        />

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit">Đăng Ký</button>
      </form>

      <button type="button" onClick={onToggleRegister}>
        Quay lại đăng nhập
      </button>
    </div>
  );
}

export default Register;