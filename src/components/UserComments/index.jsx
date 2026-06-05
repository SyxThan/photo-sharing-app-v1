import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const userRes = await fetch(`http://localhost:8081/api/user/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        const commentRes = await fetch(`http://localhost:8081/api/user/${userId}/comments`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (commentRes.ok) {
          const commentData = await commentRes.json();
          setComments(commentData);
        }
      } catch (err) {
        
      }
    };
    fetchComments();
  }, [userId]);

  return (
    <div className="user-comments-container">
      <h2>Bình luận của {user ? `${user.first_name} ${user.last_name}` : "người dùng"}</h2>
      {comments.length === 0 ? (
        <p>Khong co</p>
      ) : (
        <div className="comments-list">
          {comments.map((item, index) => (
            <div key={index} className="comment-card">
              <div className="comment-content">
                <p>"{item.comment}"</p>
                <small>{new Date(item.date_time).toLocaleString()}</small>
              </div>
              <div className="comment-photo">
                <Link to={`/photos/${item.photo.user_id}`}>
                  <p> đây</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserComments;
