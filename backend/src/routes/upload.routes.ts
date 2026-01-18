import express from 'express';
import multer from 'multer';
import { uploadFile, deleteFile } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  },
});

router.post('/file', authenticate, upload.single('file'), uploadFile);
router.delete('/file/:path', authenticate, deleteFile);

export default router;

