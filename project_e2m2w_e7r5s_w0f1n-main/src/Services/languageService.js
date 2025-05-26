const appService = require("../appService");
const withOracleDB = appService.withOracleDB;

// get all languages added to db
async function getAllLanguages() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT LanguageName, ScriptType, LanguageFamily
                FROM Language
                ORDER BY LanguageName
                `
            );

            return result.rows.map(row => ({
                language: row[0],
                scriptType: row[1],
                languageFamily: row[2]
            }));
        } catch (err) {
            console.error('Error fetching languages:', err);
            return [];
        }
    })
}

//JOIN QUERY
async function getCountriesByLanguage(languageName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT c.Name AS CountryName, s.EthnicGroupName, s.percentPopulation
             FROM SpeaksLanguage s, Country c, Language l
             WHERE s.CountryID = c.ID
               AND s.LanguageName = l.LanguageName
               AND s.LanguageName = :languageName`,
            [languageName]
        );

        console.log(result.rows, 'huh')
        if(result.rows.length === 0) {
            throw new Error("No countries speak this language")
        }
        return result.rows;
    }).catch((err) => {
        console.error("Error fetching countries by language:", err);
        return [];
    });
}

// Query 5: Projection
async function getLanguagesWithProjection(attributes) {
    return await withOracleDB(async (connection) => {
        // building query based on selected attrs
        const validColumns = {
            'languageName': 'LanguageName',
            'scriptType': 'ScriptType',
            'languageFamily': 'LanguageFamily'
        };

        // verifying attributes are ok
        const validAttributes = attributes
            .filter(attr => validColumns[attr])
            .map(attr => validColumns[attr]);

        if (validAttributes.length === 0) {
            throw new Error('No valid attributes selected');
        }

        // creating string for select
        const columnsStr = validAttributes.join(', ');

        const query = `
            SELECT ${columnsStr}
            FROM Language
            ORDER BY LanguageName
        `;

        const result = await connection.execute(query);

        // formatting
        return result.rows.map(row => {
            const obj = {};
            validAttributes.forEach((col, index) => {
                const attrName = Object.keys(validColumns).find(key => validColumns[key] === col);
                obj[attrName] = row[index];
            });
            return obj;
        });
    }).catch((err) => {
        console.error("Error fetching languages with projection:", err);
        throw err;
    });
}

//Query 8: Aggregation with Having
async function getWidelySpokenLanguages() {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
               `SELECT LanguageName, COUNT(CountryID) AS CountryCount
                            FROM IsOfficialLanguage
                            GROUP BY LanguageName
                            HAVING COUNT(CountryID) >= 2`
        );
        return result.rows;
        })
    } catch (err) {
        console.error(err);
            return {
                success: false,
                message: `Error: ${err.message}`
            };
        }
}



module.exports = {
    getAllLanguages,
    getCountriesByLanguage,
    getWidelySpokenLanguages,
    getLanguagesWithProjection
};
