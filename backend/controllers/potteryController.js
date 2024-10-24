const Pottery = require('../models/pottery');

// Fetch all pottery
exports.getAllPottery = async (req, res) => {
    try {
        const pottery = await Pottery.find();
        res.json(pottery);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Create new pottery
exports.createPottery = async (req, res) => {
    try {
        const { name, stage, specialTechniques } = req.body;

        // Create the new pottery object
        const pottery = new Pottery({
            name: name || undefined,  // If no name is provided, will default to 'id' in schema
            status: stage,
            specialTechniques: specialTechniques || '',
        });

        // Handle photo upload if a file is present
        if (req.file) {
            pottery.photos.push({
                status: pottery.status,
                photoUrl: req.file.path,
            });
        }

        // Handle glaze combo if it's provided
        if (req.body.glaze_combo) {
            pottery.glaze_combo = JSON.parse(req.body.glaze_combo);
        }

        // Save the new pottery entity to the database
        await pottery.save();

        res.status(201).send('Pottery created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error while creating pottery');
    }
};

// Update a pottery
exports.updatePottery = async (req, res) => {
    try {
        const { name, stage, specialTechniques } = req.body;
        const pottery = await Pottery.findById(req.params.id);

        if (!pottery) {
            return res.status(404).send('Pottery not found');
        }

        // Update pottery fields
        pottery.name = name || pottery.name;
        pottery.status = stage || pottery.status;
        pottery.specialTechniques = specialTechniques || pottery.specialTechniques;

        // If a new photo is uploaded, update the photoUrl
        if (req.file) {
            pottery.photos.push({
                status: pottery.status,
                photoUrl: req.file.path,
            });
        }

        // Update glaze combo if provided
        if (req.body.glaze_combo) {
            pottery.glaze_combo = JSON.parse(req.body.glaze_combo);
        }

        await pottery.save();
        res.send('Pottery updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
