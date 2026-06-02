const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const dbConnect = require("./db/dbConnect");
const AuthRouter = require("./routes/AuthRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");

dbConnect();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-jwt-key-change-this-in-production";

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '../public')));

// Serve images from src/images directory (for test images)
app.use('/images', express.static(path.join(__dirname, '../src/images')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use(express.json());

// Middleware để kiểm tra
const requireAuth = (request, response, next) => {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ error: "Unauthorized - missing or invalid token" });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    request.userId = decoded.userId;
    next();
  } catch (error) {
    return response.status(401).json({ error: "Unauthorized - invalid or expired token" });
  }
};


app.use("/admin", AuthRouter);
app.use("/user", RegisterRouter);
app.use("/api/user", requireAuth, UserRouter);
app.use("/api/photo", requireAuth, PhotoRouter);
app.use("/api/comment", requireAuth, CommentRouter);

app.get("/", (request, response) => {
  response.send({ message: "Photo-sharing App" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});