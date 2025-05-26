const express = require('express');
const router = express.Router();

const countryService = require('../Services/countryService');

// to retrieve all countries added to db
router.get('/', async (req, res) => {
    try {
        const countries = await countryService.getAllCountries();
        res.json({
            success: true,
            data: countries
        });
    } catch (err) {
        console.error('Error fetching countries:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching countries: ' + err.message
        });
    }
});

// Route for Query 4: SELECTION Operation
router.get("/country-selection", async (req, res) => {
    // Getting parameters from query string, if they dne set to null or default value
    const conditions = {
        minPopulation: req.query.minPopulation ? parseInt(req.query.minPopulation) : 0,
        maxPopulation: req.query.maxPopulation ? parseInt(req.query.maxPopulation) : Number.MAX_SAFE_INTEGER,
        minGDP: req.query.minGDP ? parseInt(req.query.minGDP) : 0,
        maxGDP: req.query.maxGDP ? parseInt(req.query.maxGDP) : Number.MAX_SAFE_INTEGER,
        name: req.query.name !== 'null' ? req.query.name : null,
        currencyCode: req.query.currencyCode !== 'null' ? req.query.currencyCode : null
    };

    // DB Request
    const result = await countryService.countrySelection(conditions);

    if (result.success) {
        res.json(result)
    } else {
        res.status(500).json(result)
    }
})

// Route for Query 7: Aggregation with GROUP BY. Hardcoded so don't need input
router.get("/avg-city-population", async (req, res) => {
    const result = await countryService.averageCityPopulation();

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});

// Route for Query 10: Division for countries with all climate types
router.get("/countries-with-all-climate-types", async(req, res) => {
    const result = await countryService.countriesWithAllClimateTypes();

    if (result.success) {
        res.json(result)
    } else {
        res.status(500).json(result);
    }
})

module.exports = router;