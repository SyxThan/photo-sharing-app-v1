import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/user", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Khong the tai danh sach nguoi dung");
      }
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error ", error.message)
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div className="user-list-wrap">
      <ul className="user-list-nav">
        {users.map((item) => (
          <li key={item._id} className="user-list-item">
            <Link className="user-list-link" to={`/users/${item._id}`}>
              {item.first_name} {item.last_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
