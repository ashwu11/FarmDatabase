const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');
const fs = require('fs');
const path = require('path');

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

async function runInitScript() {
    return await withOracleDB(async (connection) => {
        const scriptPath = path.join(__dirname, 'scripts', 'initialize.sql');
        const sqlScript = fs.readFileSync(scriptPath, 'utf-8');

        const statements = sqlScript.split(';').map(stmt => stmt.trim()).filter(stmt => stmt);

        for (const stmt of statements) {
            try {
                await connection.execute(stmt);
            } catch (err) {
                console.error('Error executing statement:', stmt);
                console.error(err.message);
            }
        }

        await connection.commit();
        console.log('Initialization script executed.');
    });
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

initializeConnectionPool().then(async () => {
    await runInitScript();
});

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
                                      cEmail VARCHAR2(200),
                                      cName VARCHAR2(200),
                                      cPhoneNumber VARCHAR2(200),
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
                                    fName VARCHAR2(200),
                                    fPhoneNumber VARCHAR2(200) UNIQUE,
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

async function updateFarmerInfo(farmerID, newName, newNumber) {
    if (!farmerID) return false;

    return await withOracleDB(async (connection) => {
        let updates = [];
        let values = [];

        if (newName) {
            updates.push("fname=:newName");
            values.push(newName);
        }
        if (newNumber) {
            updates.push("fPhoneNumber=:newNumber");
            values.push(newNumber);
        }

        if (updates.length === 0) return false;
        values.push(farmerID);

        const result = await connection.execute(
            `UPDATE Farmer SET ${updates.join(", ")} WHERE FarmerID=:farmerID`,
            values,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteFarmerInfo(farmerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Farmer WHERE FarmerID=:farmerID`,
            [farmerID],
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

// GROUP BY + Having
async function groupTransactionHavingAmount(minTotal) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT tDate, sum(Total) AS TotalSum FROM Transaction GROUP BY tDate HAVING sum(Total) >= :minTotal `,
            [minTotal]
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
                ON DELETE SET NULL
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

// REQUIREMENT: Aggregation with Group By
async function sumTransactionsTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT SUM(Total) FROM Transaction GROUP BY cEmail'
        );
        return result.rows;
    }).catch(() => {
        return -1;
    });
}


// STORAGE BUILDING

async function fetchStorageBuildingTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM StorageBuilding');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateStorageBuildingTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE StorageBuilding`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE StorageBuilding (
                                       id NUMBER PRIMARY KEY,
                                       sbType VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertStorageBuilding(id, sbType) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO StorageBuilding (id, sbType) VALUES (:id, :sbType)`,
            [id, sbType],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Machinery
async function initiateMachineryTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Machinery`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Machinery (
                MachineID INTEGER,
			    mType VARCHAR(200), 
			    Condition VARCHAR(200),
		        PRIMARY KEY (MachineID)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchMachineryTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Machinery');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertMachineryTable(machineID, type, condition) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Machinery (MachineID, mType, Condition) VALUES (:machineID, :type, :condition)`,
            [machineID, type, condition],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// GROUP BY
async function groupMachineryByCondition() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT Condition, Count(*) AS Count FROM Machinery GROUP BY Condition'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}


// PRODUCTS

async function fetchEggProductsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT E.BatchID, P.Yield, P.CollectionDate, A.aName, B.sbType
             FROM EggRecords E, Products P, Animal A, StorageBuilding B
             WHERE E.BatchID = P.BatchID
             AND E.AnimalID = A.AnimalID
             AND E.BuildingID = B.BuildingID`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchDairyProductsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT D.BatchID, D.dType, P.Yield, P.CollectionDate, A.aName, B.sbType
             FROM DairyRecords D, Products P, Animal A, StorageBuilding B
             WHERE D.BatchID = P.BatchID
             AND D.AnimalID = A.AnimalID
             AND D.BuildingID = B.BuildingID`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCropProductsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT C.BatchID, C.crType, P.Yield, C.PlantDate, P.CollectionDate, B.sbType
             FROM Crop C, Products P, StorageBuilding B
             WHERE C.BatchID = P.BatchID
             AND C.BuildingID = B.BuildingID`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// ANIMALS

async function selectionOnAnimals(clauses) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM Animal WHERE ${clauses}`);
        return result.rows;
    }).catch((err) => {
        console.log(err);
        return [];
    });
}

async function fetchCowTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT C.AnimalID, A.aName, A.Age, A.PenNumber, A.Weight
             FROM Animal A, Cow C
             WHERE A.AnimalID = C.AnimalID`
        );
        return result.rows;
    }).catch(() => {
        return [];
    })
}

// Nested aggregation with GROUP BY
async function fetchUnderweightCowsFromDb() {
    return await withOracleDB(async (connection) => {
        await connection.execute(
            `CREATE OR REPLACE VIEW MatureCow AS
            SELECT * FROM Animal WHERE Age >= 3 AND AnimalID IN (SELECT AnimalID From Cow)`
        );
        await connection.commit();

        const result = await connection.execute(
            `SELECT COUNT(C1.AnimalID)
            FROM MatureCow C1
            WHERE C1.Weight <= ALL(SELECT AVG(C2.Weight)
                                  FROM MatureCow C2
                                  GROUP BY Age)`
        );

        return result.rows.length > 0 ? result.rows[0][0] : 0;
    }).catch(() => {
        return 0;
    });
}

async function fetchChickenTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT C.AnimalID, A.aName, A.Age, A.PenNumber, A.Weight
             FROM Animal A, Chicken C
             WHERE A.AnimalID = C.AnimalID`
        );
        return result.rows;
    }).catch(() => {
        return [];
    })
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
    updateFarmerInfo,
    deleteFarmerInfo,
    initiateShiftTable,
    fetchShiftTableFromDb,
    insertShiftTable,
    findShiftFarmerInformation,
    initiateTransactionTable,
    fetchTransactionTableFromDb,
    insertTransactionTable,
    projectTransactionColumns,
    sumTransactionsTable,
    initiateStorageBuildingTable,
    fetchStorageBuildingTableFromDb,
    insertStorageBuilding,
    initiateMachineryTable,
    fetchMachineryTableFromDb,
    insertMachineryTable,
    groupMachineryByCondition,
    groupTransactionHavingAmount,
    fetchEggProductsFromDb,
    fetchDairyProductsFromDb,
    fetchCropProductsFromDb,
    selectionOnAnimals,
    fetchCowTableFromDb,
    fetchChickenTableFromDb,
    fetchUnderweightCowsFromDb
};


