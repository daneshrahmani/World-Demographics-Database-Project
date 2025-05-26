const express = require('express')
const router = express.Router();
const currencyService = require('../Services/currencyService')

// to retrieve all currencies added to db
router.get('/', async (req, res) => {
    try {
        const currencies = await currencyService.getAllCurrencies();
        res.json({
            success: true,
            data: currencies
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching currencies: ' + err.message
        });
    }
});

// Route for Query 2: UPDATE operation
router.post("/update-currency", async (req, res) => {
    const { currencyCode, currencyName, valueAgainstUSD } = req.body;

    // Validating fields
    if (!currencyName || !currencyCode || !valueAgainstUSD) {
        return res.status(400).json( {
            success: false,
            message: "Missing required fields for update operation"
        });
    }

    // Making DB Request
    const result = await currencyService.updateCurrency(currencyCode, currencyName, valueAgainstUSD);

    if (result.success) {
        res.json(result)
    } else {
        res.status(500).json(result)
    }
})

module.exports = router;