const appService = require("../appService");
const withOracleDB = appService.withOracleDB;

// get all countries added to db
async function getAllCountries() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT ID, Name, Population, GDP, SurfaceArea, CurrencyCode
                FROM Country 
                ORDER BY Name`
            );

            return result.rows.map(row => ({
                id: row[0],
                name: row[1],
                population: row[2],
                gdp: row[3],
                surfaceArea: row[4],
                currencyCode: row[5]
            }));
        } catch (err) {
            console.error('Error fetching countries:', err);
            return [];
        }
    });
}

// Query 4 -- countrySelection  Operation
async function countrySelection(conditions) {
    return await withOracleDB(async (connection) => {
        try {
            let query = `SELECT *
                         FROM Country
                         WHERE 1=1`;
            const params = {};

            // Building WHERE based on conditions
            if (conditions.minPopulation) {
                query += ` AND Population >= :minPopulation`;
                params.minPopulation = conditions.minPopulation;
            }

            if (conditions.maxPopulation) {
                query += ` AND Population <= :maxPopulation`;
                params.maxPopulation = conditions.maxPopulation;
            }

            if (conditions.minGDP) {
                query += ` AND GDP >= :minGDP`;
                params.minGDP = conditions.minGDP;
            }

            if (conditions.maxGDP) {
                query += ` AND GDP <= :maxGDP`;
                params.maxGDP = conditions.maxGDP;
            }

            if (conditions.name) {
                query += ` AND LOWER(Name) LIKE LOWER(:name)`;
                params.name = `%${conditions.name}%`;
            }

            if (conditions.currencyCode) {
                query += ` AND CurrencyCode = :currencyCode`;
                params.currencyCode = conditions.currencyCode;
            }

            // Execute the query with completed WHERE clause based on conditions
            const result = await connection.execute(query, params);

            // results to a more usable format
            const countries = result.rows.map(row => ({
                id: row[0],
                name: row[1],
                population: row[2],
                gdp: row[3],
                surfaceArea: row[4],
                currencyCode: row[5]
            }));

            if (countries.length !== 0) {
                countryNameList = countries.map(country => country.name
                ).join(", ")
            }

            return {
                success: true,
                message: `Found ${countries.length} countries matching the conditions: ${countryNameList}`,
                data: countries
            };
        } catch (err) {
            return {
                success: false,
                message: `Error: ${err.message}`
            }
        }
    });
}

// Query 7: Aggregation with GROUP BY --> Avg city population by Country
async function averageCityPopulation() {
    return await withOracleDB(async (connection) => {
        try {
            const query = `
                SELECT Co.ID as CountryID, 
                       Co.Name as CountryName, 
                       AVG(Ci.Population) as AvgCityPopulation,
                       COUNT(Ci.CityName) as CityCount
                FROM Country Co
                JOIN City Ci ON Co.ID = Ci.CountryID
                GROUP BY Co.ID, Co.Name
                ORDER BY AvgCityPopulation DESC
            `;

            const result = await connection.execute(query);

            // Formatting query results
            const avgPopulations = result.rows.map(row => ({
                countryId: row[0],
                countryName: row[1],
                averageCityPopulation: Math.round(row[2]),
                cityCount: row[3]
            }));

            return {
                success: true,
                message: "Average city population by country retrieved successfully",
                data: avgPopulations
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: `Error: ${err.message}`
            };
        }
    });
}

// Query 10: Division
async function countriesWithAllClimateTypes() {
    return await withOracleDB(async (connection) => {
        try {
            const query = `
                SELECT C.ID, C.Name
                FROM Country C
                WHERE NOT EXISTS (
                    SELECT CT.ClimateTypeID
                    FROM ClimateType CT
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM HasClimateType HCT
                        WHERE HCT.CountryID = C.ID 
                        AND HCT.ClimateTypeID = CT.ClimateTypeID
                    )
                )
                ORDER BY C.Name
            `;

            const result = await connection.execute(query);

            // formatting results
            const countries = result.rows.map(row => ({
                id: row[0],
                name: row[1]
            }));

            return {
                success: true,
                message: "Countries that have all climate types retrieved successfully",
                data: countries
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: `Error: ${err.message}`
            };
        }
    });
}

module.exports = {
    getAllCountries,
    countrySelection,
    averageCityPopulation,
    countriesWithAllClimateTypes
}