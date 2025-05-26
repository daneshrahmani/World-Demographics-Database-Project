const fs = require('fs');
const path = require('path');
const appService = require('../appService');

// Initializing the database with initialization.sql
async function initializeDatabase() {
    return await appService.withOracleDB(async (connection) => {
        console.log('in initdatabase')
        try {
            const scriptPath = path.join(__dirname, '../../database/initialization.sql');
            const script = fs.readFileSync(scriptPath, 'utf8');

            // Split the script into the different statements (DROP TABLE, CREATE, INSERT)
            const statements = script.split(';').map(statement => statement.trim()).filter(statement => statement);

            // statement execution
            for (const statement of statements) {
                if (statement) {
                    try {
                        console.log(`Executing SQL statement: ${statement.substring(0, 50)}...`);
                        await connection.execute(statement);
                    } catch (err) {
                        console.error(`Error executing statement: ${statement}`);
                        console.error(err);
                    }
                }
            }

            await connection.execute('COMMIT');
            console.log('Database initialization completed successfully');

            return {
                success: true,
                message: 'Database initialized successfully'
            };
        } catch (err) {
            console.error('Database initialization failed:', err);
            return {
                success: false,
                message: `Database initialization failed: ${err.message}`
            };
        }
    });
}

module.exports = {
    initializeDatabase
};