const appService = require("../appService");
const withOracleDB = appService.withOracleDB;

// get all gdp values added to db
async function getAllGDP() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT Name, GDP
                FROM Country 
                ORDER BY Name`
            );

            return result.rows.map(row => ({
                name: row[0],
                gdp: row[1]
            }));
        } catch (err) {
            console.error('Error fetching gdp values:', err);
            return [];
        }
    });
}

//Query 9: Nested group by aggregation to get lowest average gdp across all continents
async function lowestAvgGdpAcrossContinents() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(

            `SELECT l.ContinentName
             FROM Country c, LocatedIn l
             WHERE c.ID = l.CountryID
             GROUP BY l.ContinentName
             HAVING AVG(c.GDP) <= ALL (
                 SELECT AVG(c2.GDP)
                 FROM Country c2, LocatedIn l2
                 WHERE c2.ID = l2.CountryID
                 GROUP BY l2.ContinentName
             )`
        );

        return result.rows;

    }).catch((err) => {
        console.error("Error fetching average GDP per continent:", err);
        return [];
    });
}

module.exports = {
    getAllGDP,
    lowestAvgGdpAcrossContinents
}