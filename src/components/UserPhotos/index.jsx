import React, { useEffect, useState } from "react";
import "./styles.css";
import { useParams } from "react-router-dom";
import AddComment from "../AddComment";
import UserComment from "../UserComment";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("loggedInUser");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setLoggedInUserId(user._id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/photo/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
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

  useEffect(() => {
    const handlePhotoUploaded = () => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:8081/api/photo/user/${userId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error("Khong the tai danh sach anh");
          }
          const data = await response.json();
          setPhotos(Array.isArray(data) ? data : []);
        } catch (error) {
          console.log("Khong fetch duoc anh:", error.message);
        }
      };
      fetchData();
    };

    window.addEventListener("photoUploaded", handlePhotoUploaded);
    return () => {
      window.removeEventListener("photoUploaded", handlePhotoUploaded);
    };
  }, [userId]);

  const handleCommentAdded = (updatedPhoto) => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );

    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => {
        if (photo._id === updatedPhoto._id) {
          // Khôi phục lại thông tin user cho từng comment
          updatedPhoto.comments?.forEach((newComment, index) => {
            const oldComment = photo.comments?.find(c => c._id === newComment._id);
            
            // Nếu comment đã tồn tại trước đó, lấy lại thông tin user đã có đầy đủ first_name, last_name
            if (oldComment && oldComment.user_id && typeof oldComment.user_id !== "string") {
              newComment.user_id = oldComment.user_id;
            } 
            // Nếu là comment mới (chưa có trong danh sách cũ), gán thông tin user đang đăng nhập
            else if (typeof newComment.user_id === "string" || !newComment.user_id?.first_name) {
              newComment.user_id = {
                _id: loggedInUser._id,
                first_name: loggedInUser.first_name,
                last_name: loggedInUser.last_name,
              };
            }
          });

          return updatedPhoto;
        }
        return photo;
      })
    );
  };

  if (!photos) {
    return <p>Không có ảnh để hiển thị.</p>;
  }

  return (
    <div className="user-photos-wrap">
      {photos.map((photo) => (
        <article key={photo._id} className="photo-card">
          <img
            className="photo-image"
            src={`http://localhost:8081/images/${photo.file_name}`}
            alt={photo.file_name}
          />
          <p className="photo-date">Ngày đăng: {photo.date_time}</p>

          <h3 className="photo-comments-title">Bình luận:</h3>

          <ul className="photo-comments-list">
            {photo.comments && photo.comments.map((com) => (
              <UserComment key={com._id} comment={com} />
            ))}
          </ul>

          {loggedInUserId && (
            <AddComment photoId={photo._id} onCommentAdded={handleCommentAdded} />
          )}
        </article>
      ))}
    </div>
  );
}

export default UserPhotos;
