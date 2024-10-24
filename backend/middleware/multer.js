const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Pottery = require('../models/pottery');
const app = express();

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Define storage for the uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // File name
    }
});

// Initialize Multer with storage settings
const upload = multer({ storage: storage, dest: 'uploads/' });

app.post('/upload', upload.single('photo'), async (req, res) => {
    const { name, stage } = req.body;
    const pottery = new Pottery({
      name,
      stage,
      photoUrl: req.file.path,  // path to where the image is stored
    });
    await pottery.save();
    res.send('Pottery added successfully');
  });

  app.put('/upload/:id', upload.single('photo'), async (req, res) => {
    try {
        const pottery = await Pottery.findById(req.params.id);
        if (!pottery) {
            return res.status(404).send('Pottery not found');
        }

        const { name, stage } = req.body;

        // Update name and stage if provided
        pottery.name = name || pottery.name;
        pottery.status = stage || pottery.status;

        // If a new photo is uploaded, update the photoUrl
        if (req.file) {
          pottery.photos.push({
            status: pottery.status,
            photoUrl: req.file.path,
        });
        }

        await pottery.save();
        res.send('Pottery updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating pottery');
    }
});

module.exports = upload;
