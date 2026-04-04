import models from "../src/modelData/models.js";
import express from "express";
import cors from "cors";
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.get("/test/info", (req, res) => {
    return res.json("This URL is useful for testing your model fetching method.")
});

app.get("/user/list", (req, res) => {
    return res.json(models.userListModel());
})

app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    return res.json(models.userModel(userId));
});

app.get("/photos/:id", (req, res) => {
    const photoId = req.params.id;
    return res.json(models.photoOfUserModel(photoId));
});

app.listen(port, () => {
    console.log(`Server chạy ở cổng ${port}`);
});