import React, { useEffect, useState } from "react";

import "./styles.css";
import { useParams, Link } from "react-router-dom";


function UserDetail() {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Khong the tai thong tin nguoi dung");
        }
        const data = await response.json(); 
        setUser(data);
      } catch (error) {
        console.log("Khong fetch duoc", error.message);
      }
    }
    
    fetchData();
  }, [userId]);
  if (!user) {
    return <p>Không tìm thấy người dùng.</p>;
  }

  return (
    <div className="user-detail-wrap">
      <p>
        {`Name: ${user.first_name} ${user.last_name}`}
      </p>
      <p>
        {`Address: ${user.location}`}
      </p>
      <p>
        {`Occupation: ${user.occupation}`}
      </p>
      <p>
        {`Description: ${user.description}`}
      </p>
      <Link className="user-detail-link" to={`/photos/${user._id}`}>
        Xem chi tiết ảnh của người dùng
      </Link>
    </div>
  );
}

export default UserDetail;
