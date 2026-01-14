const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;


if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const allowedTypes = [".jpg", ".png", ".pdf"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, png and pdf files allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

// upload single file
app.post("/upload-single", upload.single("file"), (req, res) => {
  res.json({
    message: "Single file uploaded",
    file: req.file
  });
});

// upload multiple files
app.post("/upload-multiple", upload.array("files", 5), (req, res) => {
  res.json({
    message: "Multiple files uploaded",
    files: req.files
  });
});

// list all uploaded files
app.get("/files", (req, res) => {
  const files = fs.readdirSync("uploads");
  res.json(files);
});

// delete file
app.delete("/delete/:filename", (req, res) => {
  const filePath = path.join("uploads", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  fs.unlinkSync(filePath);
  res.json({ message: "File deleted" });
});



app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});
