const appService = require("../appService");
const withOracleDB = appService.withOracleDB;

async function getAllCities() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // This query joins City and Country tables to get both city and country names
            const result = await connection.execute(
                `SELECT c.CityName, co.Name as CountryName, c.Population
                 FROM City c
                 JOIN Country co ON c.CountryID = co.ID
                 ORDER BY co.Name, c.CityName`
            );

            return result.rows.map(row => ({
                cityName: row[0],
                countryName: row[1],
                population: row[2]
            }));
        } catch (err) {
            console.error('Error fetching cities:', err);
            throw err;
        }
    });
}

// Query 1 -- INSERT Operation
async function insertCity(cityName, countryId, population) {
    return await withOracleDB(async (connection) => {
        try {
            // Checking that Country exists
            const countryCheck = await connection.execute(
                `SELECT 1 FROM Country WHERE ID = :countryId`,
                [countryId]
            )

            // Error message if Country doesn't exist
            if (countryCheck.rows.length === 0) {
                return { success: false, message: 'Provided Country does not exist'}
            }

            // Inserting city into City table
            const result = await connection.execute(
                `INSERT INTO City (CityName, CountryID, Population)
                VALUES (:cityName, :countryId, :population)`,
                [cityName, countryId, population],
                { autoCommit: true }
            )

            return {
                success: true,
                message: `City: ${cityName} added successfully to ${countryId} with population ${population}`,
                rowsAffected: result.rowsAffected
            }
        } catch (err) {
            alert('Could not add City')
            return {
                success: false,
                message: `Error: Could not add City!`
            }
        }
    })
}

// Query 3: DELETE Operation
async function deleteCity(cityName, countryID) {
    return await withOracleDB(async (connection) => {
        try {
            return await withOracleDB(async (connection) => {
                try {
                    // Check whether the city exists in the country
                    const cityCheck = await connection.execute(
                        `SELECT 1 FROM City 
                        WHERE CityName = :cityName AND CountryID = :countryID`,
                        [cityName, countryID]
                    );

                    if (cityCheck.rows.length === 0) {
                        return {
                            success: false,
                            message: `City '${cityName}' does not exist in the specified country`
                        };
                    }

                    // Deleting the city
                    const result = await connection.execute(
                        `DELETE FROM City 
                        WHERE CityName = :cityName AND CountryID = :countryID`,
                        [cityName, countryID],
                        { autoCommit: true }
                    );

                    return {
                        success: true,
                        message: `City '${cityName}' has been deleted from ${countryID}`,
                        rowsAffected: result.rowsAffected
                    };
                } catch (err) {
                    alert('Could not delete City')
                    return {
                        success: false,
                        message: `Error: ${err.message}`
                    };
                }
            });
        } catch (err) {

        }
    })
}

module.exports = {
    getAllCities,
    insertCity,
    deleteCity
};