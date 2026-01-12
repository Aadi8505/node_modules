const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
// Ensure base upload folders exist
const BASE_DIR = "uploads";
const FOLDERS = ["profile_pics", "documents", "others"];

FOLDERS.forEach(folder => {
  const dir = path.join(BASE_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
// File Validation
const allowedTypes = [".jpg", ".png", ".pdf", ".docx"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error("Invalid file type"));
  }
  cb(null, true);
};
// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.userId;
    let folder = "others";

    if (file.fieldname === "profilePic") folder = "profile_pics";
    if (file.fieldname === "docs") folder = "documents";

    const uploadPath = path.join(BASE_DIR, folder, userId);

    // Create folder dynamically
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const userId = req.params.userId;
    const timestamp = Date.now();
    const filename = `${file.fieldname}-${userId}-${timestamp}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


// Serve Static Files

app.use("/uploads", express.static("uploads"));

// ------------------------------------
// Upload Route
// POST /upload/:userId
// ------------------------------------
app.post(
  "/upload/:userId",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "docs", maxCount: 5 },
    { name: "others", maxCount: 5 }
  ]),
  (req, res) => {
    const files = req.files;

    const response = {
      profilePic: files.profilePic
        ? files.profilePic[0].path
        : null,
      docs: files.docs ? files.docs.map(f => f.path) : [],
      others: files.others ? files.others.map(f => f.path) : []
    };

    res.json({
      message: "Files uploaded successfully!",
      uploaded: response
    });
  }
);
// Multer Error Handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.code,
      message: err.message
    });
  }

  if (err.message === "Invalid file type") {
    return res.status(400).json({ message: err.message });
  }

  next(err);
});
// GET /files/:userId
// List all user files
app.get("/files/:userId", (req, res) => {
  const userId = req.params.userId;
  const allFiles = [];

  FOLDERS.forEach(folder => {
    const userFolder = path.join(BASE_DIR, folder, userId);

    if (fs.existsSync(userFolder)) {
      const files = fs.readdirSync(userFolder);
      files.forEach(file => {
        allFiles.push(path.join(userFolder, file));
      });
    }
  });

  res.json({
    userId,
    files: allFiles
  });
});
// DELETE /delete/:userId/:filename
app.delete("/delete/:userId/:filename", (req, res) => {
  const { userId, filename } = req.params;
  let fileFound = false;

  for (const folder of FOLDERS) {
    const filePath = path.join(BASE_DIR, folder, userId, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      fileFound = true;
      break;
    }
  }

  if (!fileFound) {
    return res.status(404).json({ message: "File not found" });
  }

  res.json({ message: "File deleted successfully!" });
});

// ------------------------------------
app.listen(PORT, () => {
  console.log(`FileManager running at http://localhost:${PORT}`);
});
