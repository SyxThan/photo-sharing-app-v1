import React, { useEffect, useState } from "react";

import "./styles.css";
import { useParams, Link } from "react-router-dom";
/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  const getCommentUserLabel = (comment) => {
    if (comment.user && comment.user.first_name && comment.user.last_name) {
      return `${comment.user.first_name} ${comment.user.last_name}`;
    }

    return comment.user_id || "Người dùng";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/photo/user/${userId}`);
        if (!response.ok) {
          throw new Error("Khong the tai danh sach anh");
        }
        const data = await response.json();
        setPhotos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Khong fetch duoc anh:", error.message);
        setPhotos([]);
      }
    };

    fetchData();
  }, [userId]);

  if (!photos) {
    return <p>Không có ảnh để hiển thị.</p>;
  }

  return (
    <div className="user-photos-wrap">
      {photos.map((photo) => (
        <article key={photo._id} className="photo-card">
          <img 
            className="photo-image"
            src={require(`../../images/${photo.file_name}`)} 
            alt={photo.file_name} 
          />
          <p className="photo-date">Ngày đăng: {photo.date_time}</p>

          <h3 className="photo-comments-title">Bình luận:</h3>

          <ul className="photo-comments-list">
            {photo.comments && photo.comments.map((com) => (
              <li key={com._id} className="photo-comment-item">
                <div className="photo-comment-content">
                  <Link className="photo-comment-user" to={`/users/${com.user?._id || com.user_id}`}>
                    {getCommentUserLabel(com)}
                  </Link>
                  <p>{com.comment}</p>           
                  <small>{com.date_time}</small>
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default UserPhotos;
