import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function UserComment({ comment, photoId, loggedInUserId, onPhotoUpdated }) {
  const user = comment.user_id;
  const isOwner = user?._id === loggedInUserId;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xoá bình luận này?")) return;
    
    try {
      const res = await fetch(`http://localhost:8081/api/photo/${photoId}/comment/${comment._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      if (res.ok) {
        const updatedPhoto = await res.json();
        if (onPhotoUpdated) onPhotoUpdated(updatedPhoto);
      } else {
        alert("Không thể xóa bình luận.");
      }
    } catch (err) {
      alert("Lỗi khi xóa bình luận.");
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      alert("Vui lòng nhập nội dung bình luận.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/photo/${photoId}/comment/${comment._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ comment: editText.trim() })
      });
      if (res.ok) {
        const updatedPhoto = await res.json();
        if (onPhotoUpdated) onPhotoUpdated(updatedPhoto);
        setIsEditing(false);
      } else {
        alert("Không thể sửa bình luận.");
      }
    } catch (err) {
      alert("Lỗi khi sửa bình luận.");
    }
  };

  return (
    <li className="user-comment-item">
      <div className="user-comment-content">
        <Link className="user-comment-author" to={`/users/${user?._id}`}>
          {user?.first_name
            ? `${user.first_name} ${user.last_name}`
            : "Người dùng"}
        </Link>

        {isEditing ? (
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <textarea 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)}
              rows="3"
              style={{ width: "100%", marginBottom: "5px" }}
            />
            <button onClick={handleEdit} style={{ marginRight: "10px" }}>Lưu</button>
            <button onClick={() => {
              setIsEditing(false);
              setEditText(comment.comment);
            }}>Huỷ</button>
          </div>
        ) : (
          <p className="user-comment-text">{comment.comment}</p>
        )}

        <small className="user-comment-date">{comment.date_time}</small>
        
        {isOwner && !isEditing && (
          <div style={{ marginTop: "5px" }}>
            <button onClick={() => setIsEditing(true)} style={{ marginRight: "10px" }}>Sửa</button>
            <button onClick={handleDelete}>Xoá</button>
          </div>
        )}
      </div>
    </li>
  );
}

export default UserComment;
