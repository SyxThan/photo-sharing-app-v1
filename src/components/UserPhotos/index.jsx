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
        const response = await fetch(
          `http://localhost:8081/api/photo/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
          const response = await fetch(
            `http://localhost:8081/api/photo/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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

  const handlePhotoUpdated = (updatedPhoto) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo._id === updatedPhoto._id ? updatedPhoto : photo
      )
    );
  };

  const handleLike = async (photoId) => {
    try {
      const res = await fetch(`http://localhost:8081/api/photo/${photoId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const updatedPhoto = await res.json();
        handlePhotoUpdated(updatedPhoto);
      }
    } catch (err) {
      console.log(err);
    }
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

          <div style={{ margin: "10px 0" }}>
            <span style={{ marginRight: "10px" }}>
              {photo.likes ? photo.likes.length : 0} lượt thích
            </span>
            {loggedInUserId && (
              <button onClick={() => handleLike(photo._id)}>
                {(photo.likes && photo.likes.includes(loggedInUserId)) ? "Bỏ thích" : "Thích"}
              </button>
            )}
          </div>

          <h3 className="photo-comments-title">Bình luận:</h3>

          <ul className="photo-comments-list">
            {photo.comments &&
              photo.comments.map((com) => (
                <UserComment
                  key={com._id}
                  comment={com}
                  photoId={photo._id}
                  loggedInUserId={loggedInUserId}
                  onPhotoUpdated={handlePhotoUpdated}
                />
              ))}
          </ul>

          {loggedInUserId && (
            <AddComment
              photoId={photo._id}
              onCommentAdded={handlePhotoUpdated}
            />
          )}
        </article>
      ))}
    </div>
  );
}

export default UserPhotos;
