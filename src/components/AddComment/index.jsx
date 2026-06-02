import React, { useState } from "react";
import "./styles.css";

function AddComment({ photoId, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Vui lòng nhập bình luận");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            comment: comment.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể thêm bình luận");
        return;
      }

      setComment("");
      setError("");
      onCommentAdded(data);
    } catch {
      setError("Không thể kết nối server");
    }
  };

  return (
    <form className="add-comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Thêm bình luận..."
        rows="3"
      />

      {error && <p className="comment-error">{error}</p>}

      <button className="add-comment-btn" type="submit">
        Gửi bình luận
      </button>
    </form>
  );
}

export default AddComment;