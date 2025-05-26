const express = require('express');
const appService = require('./appService');
const databaseService = require('./Services/databaseService')
const countryRoutes = require("./Controllers/countryController");
const languageRoutes = require("./Controllers/languageController");
const cityRoutes = require("./Controllers/cityController");
const GDPRoutes = require("./Controllers/GDPController");
const currencyRoutes = require("./Controllers/currencyController");

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

// Reset database - rerun the initialization script
router.post('/reset-database', async (req, res) => {
    console.log('app controller reset db')
    console.log('hello')
    const result = await databaseService.initializeDatabase();

    if (result.success) {
        res.json({ success: true, message: 'Database reset successfully' });
    } else {
        res.status(500).json({ success: false, message: result.message });
    }
});

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});
router.use("/countries", countryRoutes);
router.use("/languages", languageRoutes);
router.use("/city", cityRoutes);
router.use("/gdp", GDPRoutes);
router.use("/currency", currencyRoutes);

module.exports = router;