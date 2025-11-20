const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// create storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user-profile-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

module.exports = upload;
