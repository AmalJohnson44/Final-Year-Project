import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory
const dir = path.join(__dirname, '..', 'uploads', 'idProofs');

// Ensure directory exists
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e8);
    const ext = path.extname(file.originalname);
    cb(null, 'idProof-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// ✅ Export as ES module default
export default upload;
