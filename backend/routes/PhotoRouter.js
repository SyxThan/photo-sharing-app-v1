const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Photo = require("../db/photoModel");

const router = express.Router();

// Tạo thư mục upload
const uploadFolder = path.join(__dirname, "../../public/images");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}


// Cấu hình upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({ storage });

// Lấy tất cả ảnh
router.get("/", async (req, res) => {
    try {
        const photos = await Photo.find()
            .populate("comments.user_id");

        res.json(photos);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy ảnh theo use
router.get("/user/:userId", async (req, res) => {
    try {
        const photos = await Photo.find({
            user_id: req.params.userId
        }).populate("comments.user_id");

        res.json(photos);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload ảnh mới
router.post("/new", upload.single("photo"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                error: "Không có ảnh"
            });
        }

        const newPhoto = {
            file_name: req.file.filename,
            date_time: new Date(),
            user_id: req.userId,
            comments: []
        };

        // Lưu MongoDB
        const photo = await Photo.create(newPhoto);

        res.status(201).json(photo);

    } catch (err) {

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            error: err.message
        });
    }
});

// Thêm comment
router.post("/commentsOfPhoto/:photoId", async (req, res) => {
    try {

        const photo = await Photo.findById(req.params.photoId);

        if (!photo) {
            return res.status(404).json({
                error: "Không tìm thấy ảnh"
            });
        }

        photo.comments.push({
            comment: req.body.comment,
            date_time: new Date(),
            user_id: req.userId
        });

        await photo.save();
        await photo.populate("comments.user_id");
        res.json(photo);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
            .populate("comments.user_id");

        if (!photo) {
            return res.status(404).json({
                error: "Không tìm thấy ảnh"
            });
        }
        res.json(photo);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


router.delete("/:photoId/comment/:commentId", async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);
        if (!photo) return res.status(404).json({ error: "Không tìm thấy ảnh" });
        const comment = photo.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: "Không tìm thấy bình luận" });
        
        if (comment.user_id.toString() !== req.userId) {
            return res.status(403).json({ error: "Bạn không có quyền xóa" });
        }
        photo.comments.pull(req.params.commentId);
        await photo.save();
        await photo.populate("comments.user_id");
        res.json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put("/:photoId/comment/:commentId", async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);
        if (!photo) return res.status(404).json({ error: "Không tìm thấy ảnh" });
        const comment = photo.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: "Không tìm thấy bình luận" });
        
        if (comment.user_id.toString() !== req.userId) {
            return res.status(403).json({ error: "Bạn không có quyền sửa" });
        }
        
        comment.comment = req.body.comment;
        await photo.save();
        await photo.populate("comments.user_id");
        res.json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/:photoId/like", async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);
        if (!photo) return res.status(404).json({ error: "Không tìm thấy ảnh" });
        
        const index = photo.likes.indexOf(req.userId);
        if (index === -1) {
            photo.likes.push(req.userId);
        } else {
            photo.likes.splice(index, 1);
        }
        
        await photo.save();
        await photo.populate("comments.user_id");
        res.json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;