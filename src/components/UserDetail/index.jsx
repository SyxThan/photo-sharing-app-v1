import React, { useEffect, useState } from "react";

import "./styles.css";
import {useParams, Link} from "react-router-dom";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const fetchData = async() =>{
      try{
        const response = await fetch(`http://localhost:8081/api/user/${userId}`);
        if(!response.ok) {
          throw new Error("Khong the tai thong tin nguoi dung");
        }
        const data = await response.json();
        setUser(data);
      } catch (error){
        console.log("Khong fetch duoc", error.message);
      }
    }
    useEffect(() => {
      fetchData();
    },[userId]);
    if (!user) {
      return <p>Không tìm thấy người dùng.</p>;
    }

    return (
        <div className="user-detail-wrap">
          <p>
            This should be the UserDetail view of the PhotoShare app. Since it is
            invoked from React Router the params from the route will be in property match.
            So this should show details of user: {user._id}.
            You can fetch the model for the user from models.userModel.
          </p>
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
