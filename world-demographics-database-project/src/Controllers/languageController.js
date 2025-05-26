const express = require("express");
const router = express.Router();
const languageService = require('../Services/languageService')

// to retrieve all languages added to db
router.get('/', async (req, res) => {
    try {
        const languages = await languageService.getAllLanguages();
        res.json({
            success: true,
            data: languages
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching languages: ' + err.message
        });
    }
});

// Query 6: JOIN
router.get("/countries-by-language", async (req, res) => {
    const languageName = req.query.language;

    if (!languageName) {
        return res.status(400).json({
            success: false,
            message: "Language name is a required parameter"
        });
    }

    try {
        const data = await languageService.getCountriesByLanguage(languageName);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch countries speaking the language",
            error: error.message
        });
    }
});

// Query 5: Projection
router.get("/language-projection", async (req, res) => {
    const attributes = req.query.attributes?.split(',');

    if (!attributes || attributes.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please provide attributes to project"
        });
    }

    try {
        const data = await languageService.getLanguagesWithProjection(attributes);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch languages with projection",
            error: error.message
        });
    }
});

// Query 8: Aggregation with Having
router.get("/get-widely-spoken-languages", async (req, res) => {
    try {
        const data = await languageService.getWidelySpokenLanguages();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Widely Spoken Languages",
            error: error.message
        });
    }
});

module.exports = router;
