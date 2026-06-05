import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const UserListItem = ({ user }) => {
  const [stats, setStats] = useState({ photoCount: 0, commentCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/user/${user._id}/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.log("Error fetching stats", error);
      }
    };
    fetchStats();
  }, [user._id]);

  return (
    <li className="user-list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link className="user-list-link" to={`/users/${user._id}`} style={{ flexGrow: 1 }}>
        {user.first_name} {user.last_name}
      </Link>
      <div style={{ display: "flex", gap: "5px" }}>
        <span style={{ backgroundColor: "#4CAF50", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
          {stats.photoCount}
        </span>
        <Link to={`/comments/${user._id}`} style={{ textDecoration: "none" }}>
          <span style={{ backgroundColor: "#f44336", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            {stats.commentCount}
          </span>
        </Link>
      </div>
    </li>
  );
};

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
          <UserListItem key={item._id} user={item} />
        ))}
      </ul>
    </div>
  );
}

export default UserList;
