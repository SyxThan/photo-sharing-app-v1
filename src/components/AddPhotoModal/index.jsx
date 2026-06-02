import React, { useState } from "react";
import "./styles.css";

function AddPhotoModal({ isOpen, onClose, onPhotoAdded }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:8081/api/photo/new", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload thất bại");
        return;
      }

      onPhotoAdded(data);
      setFile(null);
      setError("");
      onClose();
    } catch {
      setError("Không thể kết nối server");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h2>Thêm ảnh mới</h2>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="file-input-wrapper">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file-upload" className="file-input-label">
              {file ? file.name : "Nhấn để chọn ảnh"}
            </label>
          </div>

          {error && <p className="error-message">{error}</p>}

          {file && (
            <div className="preview-section">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-upload" onClick={handleUpload}>
            Tải lên
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddPhotoModal;