const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/resumes/';
        if (file.fieldname === 'jdFile') {
            uploadPath = 'uploads/jds/';
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.pdf', '.docx', '.txt', '.md'];
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('Only PDF, DOCX, TXT, and MD files are allowed'));
        }
        cb(null, true);
    }
});

module.exports = upload;
