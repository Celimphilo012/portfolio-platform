import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const valid =
    allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  valid ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const pdfFilter = (req, file, cb) => {
  file.mimetype === 'application/pdf'
    ? cb(null, true)
    : cb(new Error('Only PDF files are allowed'));
};
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Images only'));
  },
});

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('image');

export const uploadPDF = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('resume');
