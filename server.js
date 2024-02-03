const express = require('express');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const app = express();
const port = 3000;

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve HTML page with dynamic CSS
app.get('/', (req, res) => {
    const dynamicStyles = fs.readFileSync(path.join(__dirname, 'dynamic-styles.css'), 'utf-8');
    res.render('index', { dynamicStyles });
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded.' });
    }

    const { filename } = req.file;
    res.json({ filename });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
