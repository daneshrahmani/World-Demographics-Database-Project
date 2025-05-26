const express = require('express');
const router = express.Router();
const cityService = require('../Services/cityService');

// getting all cities
router.get("/", async (req, res) => {
    try {
        const cities = await cityService.getAllCities();

        res.json({
            success: true,
            data: cities
        });
    } catch (err) {
        console.error('Error fetching all cities:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching cities: ' + err.message
        });
    }
});

// Route for Query 1: INSERT operation
router.post("/insert-city", async (req, res) => {
    const { cityName, countryId, population } = req.body;

    // Validating fields
    if (!cityName || !countryId || !population) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // DB Request
    const result = await cityService.insertCity(cityName, countryId, population);

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});


// Route for Query 3: DELETE Operation
router.delete("/delete-city", async (req, res) => {
    const { cityName, countryID } = req.body;

    // Validating required params
    if (!cityName || !countryID) {
        return res.status(400).json({
            success: false,
            message: "City name and country ID are required"
        });
    }

    const result = await cityService.deleteCity(cityName, countryID);

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});

module.exports = router;