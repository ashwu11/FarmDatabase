const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// FARM MANAGEMENT **********************************************************************************************************

//Customer 
async function initiateCustomerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Customer`);
        } catch (err) {

            if (err.errorNum === 942) {
                console.log('Table might not exist, proceeding to create...');

            } else if (err.errorNum === 955 || err.errorNum === 2449) {
                console.log('Transaction table referencing Customer. Must drop Transaction first');
                await connection.execute(`DROP TABLE Transaction`);
                console.log('Transaction table droppped');
                await connection.execute(`DROP TABLE Customer`);
            } else {
                console.log('Unexpected error dropping Customer table:', err);
                throw err;
            }
        }

        console.log('Now creating Customer table');
        const result = await connection.execute(`
            CREATE TABLE Customer (
                cEmail VARCHAR(200),
                cName VARCHAR(200),
                cPhoneNumber VARCHAR(200),
                PRIMARY KEY (cEmail)
            )
        `);

        console.log('Please reset the Transaction table');
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchCustomerTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Customer');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertCustomerTable(email, name, phoneNumber) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Customer (cEmail, cName, cPhoneNumber) VALUES (:email, :name, :phoneNumber)`,
            [email, name, phoneNumber],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Farmer
async function initiateFarmerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Farmer`);
        } catch (err) {

            if (err.errorNum === 942) {
                console.log('Table might not exist, proceeding to create...');

            } else if (err.errorNum === 955 || err.errorNum === 2449) {
                console.log('Shift table referencing Farmer. Dropping Shift table.');
                await connection.execute(`DROP TABLE Shift`);
                console.log('Shift table droppped');
                await connection.execute(`DROP TABLE Farmer`);
            } else {
                console.log('Unexpected error dropping Farmer table:', err);
                throw err;
            }
        }

        console.log('Now creating Farmer table');
        const result = await connection.execute(`
            CREATE TABLE Farmer (
                FarmerID INTEGER,
		        fName VARCHAR(200), 
		        fPhoneNumber VARCHAR(200),
		        PRIMARY KEY (FarmerID)
            )
        `);

        console.log('Please reset the Shift table');
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchFarmerTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Farmer');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertFarmerTable(id, name, phoneNumber) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Farmer (FarmerID, fName, fPhoneNumber) VALUES (:id, :name, :phoneNumber)`,
            [id, name, phoneNumber],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//Shift

async function initiateShiftTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Shift`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Shift (
                FarmerID INTEGER,
		        sDate DATE,
		        PRIMARY KEY (FarmerID, sDate),
		        FOREIGN KEY (FarmerID) REFERENCES Farmer(FarmerID)
                ON DELETE CASCADE)
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchShiftTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Shift');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertShiftTable(FarmerID, sDate) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Shift (FarmerID, sDate) VALUES (:FarmerID, TO_DATE(:sDate, 'YYYY-MM-DD'))`,
            {
                FarmerID: FarmerID,
                sDate: sDate
            },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// REQUIREMENT: Join
async function findShiftFarmerInformation(sDate) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT F.FarmerID, F.fName, F.fPhoneNumber FROM Shift S, Farmer F WHERE S.FarmerID = F.FarmerID AND sDate = TO_DATE(:sDate, 'YYYY-MM-DD')`,
            { sDate: sDate }
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Transaction
async function initiateTransactionTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Transaction`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Transaction (
                TransactionNumber INTEGER,
		        cEmail VARCHAR(200) NOT NULL,
		        tDate DATE,
		        Total DECIMAL(10, 2),
		        PRIMARY KEY (TransactionNumber),
		        FOREIGN KEY (cEmail) REFERENCES Customer(cEmail)
                ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchTransactionTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Transaction');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertTransactionTable(TransactionNumber, cEmail, tDate, Total) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Transaction (TransactionNumber, cEmail, tDate, Total) VALUES (:TransactionNumber, :cEmail, TO_DATE(:tDate, 'YYYY-MM-DD'), :Total)`,
            {
                TransactionNumber: TransactionNumber,
                cEmail: cEmail,
                tDate: tDate,
                Total: Total
            },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//REQUIREMENT: Projection
async function projectTransactionColumns(columns) {
    return await withOracleDB(async (connection) => {
        const allowedCols = ["TransactionNumber", "cEmail", "tDate", "Total"];
        const validCols = columns.filter(col => allowedCols.includes(col));
        const colStr = validCols.join(", ");

        const result = await connection.execute(`SELECT ${colStr} FROM Transaction`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}



// FARM MANAGEMENT END **********************************************************************************************************

// SAMPLE PROJECT STARTS HERE

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    initiateCustomerTable,
    fetchCustomerTableFromDb,
    insertCustomerTable,
    initiateFarmerTable,
    fetchFarmerTableFromDb,
    insertFarmerTable,
    initiateShiftTable,
    fetchShiftTableFromDb,
    insertShiftTable,
    findShiftFarmerInformation,
    initiateTransactionTable,
    fetchTransactionTableFromDb,
    insertTransactionTable,
    projectTransactionColumns
};
