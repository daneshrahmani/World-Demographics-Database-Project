const express = require('express')
const router = express.Router();
const GDPService = require('../Services/GDPService')

// to retrieve all gdp values added to db
router.get('/', async (req, res) => {
    try {
        const gdp = await GDPService.getAllGDP();
        res.json({
            success: true,
            data: gdp
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching GDP values: ' + err.message
        });
    }
});

//QUERY 9: Nested group by aggregation
router.get("/lowest-avg-gdp-continent", async (req, res) => {
    try {
        const data = await GDPService.lowestAvgGdpAcrossContinents();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch average GDP per continent",
            error: error.message
        });
    }
});

module.exports = router;