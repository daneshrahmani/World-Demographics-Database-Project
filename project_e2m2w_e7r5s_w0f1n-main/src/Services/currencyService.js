const appService = require("../appService");
const withOracleDB = appService.withOracleDB;

// get all currencies added to db
async function getAllCurrencies() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT Code, Name, ValueAgainstUSD
                FROM Currency 
                ORDER BY Code
                `
            );

            return result.rows.map(row => ({
                code: row[0],
                name: row[1],
                valueAgainstUSD: row[2]
            }));
        } catch (err) {
            console.error('Error fetching languages:', err);
            return [];
        }
    })
}

// Query 2: UPDATE
async function updateCurrency(currencyCode, currencyName, valueAgainstUSD) {
    return await withOracleDB(async (connection) => {
        try {
            const currencyCheck = await connection.execute(
                `SELECT 1 FROM Currency WHERE Code = :currencyCode`,
                [currencyCode]
            );

            // Error message if Currency doesn't exist
            if (currencyCheck.rows.length === 0) {
                return { success: false, message: 'Provided Currency does not exist' };
            }

            // Updating Currency Name and Value Against USD
            const result = await connection.execute(
                `UPDATE Currency
                 SET Name = :currencyName, ValueAgainstUSD = :valueAgainstUSD
                 WHERE Code = :currencyCode`,
                [currencyName, valueAgainstUSD, currencyCode],
                { autoCommit: true }
            );
            // FK Currency Name should be updated here but Oracle does not support ON UPDATE CASCADE

            return {
                success: true,
                message: `Currency ${currencyCode} has been updated. 
                New Name: ${currencyName}, 
                New Value against USD: ${valueAgainstUSD}`,
                rowsAffected: result.rowsAffected
            };
        } catch (err) {
            alert('Could not update Currency')
            return {
                success: false,
                message: `Error: ${err.message}`
            };
        }
    });
}

module.exports = {
    getAllCurrencies,
    updateCurrency,
}