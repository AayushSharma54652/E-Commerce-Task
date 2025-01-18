import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored (ensure this folder exists)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Add a unique suffix
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Set the filename with the extension
  }
});

// File filter to allow only image files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  
  // Check if the file is an allowed image type
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Allow the file to be uploaded
  } else {
    const error = new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.") as any;
    cb(error, false); // Reject the file with an error
  }
};

// Initialize multer with the defined storage engine and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

export default upload;
