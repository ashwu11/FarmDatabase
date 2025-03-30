const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// FARM MANAGEMENT **********************************************************************************************************

//Customer
router.post("/initiate-customer-table", async (req, res) => {
    const initiateResult = await appService.initiateCustomerTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/get-customer-table', async (req, res) => {
    const tableContent = await appService.fetchCustomerTableFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-customer-table", async (req, res) => {
    const { email, name, phoneNumber } = req.body;
    const insertResult = await appService.insertCustomerTable(email, name, phoneNumber);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//Farmer
router.post("/initiate-farmer-table", async (req, res) => {
    const initiateResult = await appService.initiateFarmerTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/get-farmer-table', async (req, res) => {
    const tableContent = await appService.fetchFarmerTableFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-farmer-table", async (req, res) => {
    const { id, name, phoneNumber } = req.body;
    const insertResult = await appService.insertFarmerTable(id, name, phoneNumber);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-farmer-info", async (req, res) => {
    const { farmerID, newName, newNumber } = req.body;
    const updateResult = await appService.updateFarmerInfo(farmerID, newName, newNumber);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-farmer-info", async (req, res) => {
    const { farmerID } = req.body;
    const updateResult = await appService.deleteFarmerInfo(farmerID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//Shift
router.post("/initiate-shift-table", async (req, res) => {
    const initiateResult = await appService.initiateShiftTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/get-shift-table', async (req, res) => {
    const tableContent = await appService.fetchShiftTableFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-shift-table", async (req, res) => {
    const { FarmerID, sDate } = req.body;
    const insertResult = await appService.insertShiftTable(FarmerID, sDate);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/get-shift-farmer-info', async (req, res) => {
    const { sDate } = req.body;
    const tableContent = await appService.findShiftFarmerInformation(sDate);
    res.json({ data: tableContent });
});

//Transaction
router.post("/initiate-transactions-table", async (req, res) => {
    const initiateResult = await appService.initiateTransactionTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/get-transactions-table', async (req, res) => {
    const tableContent = await appService.fetchTransactionTableFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-transactions-table", async (req, res) => {
    const { TransactionNumber, cEmail, tDate, Total } = req.body;
    const insertResult = await appService.insertTransactionTable(TransactionNumber, cEmail, tDate, Total);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/project-transactions', async (req, res) => {
    const { columns } = req.body;
    const projected = await appService.projectTransactionColumns(columns);
    res.json({ data: projected });
});

router.post("/sum-grouped-transactions", async (req, res) => {
    const results = await appService.sumTransactionsTable();
    res.json({ data: results });
});

// STORAGE BUILDING

router.get('/storage-building-table', async (req, res) => {
    const tableContent = await appService.fetchStorageBuildingTableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-storage-building-table", async (req, res) => {
    const initiateResult = await appService.initiateStorageBuildingTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-storage-building", async (req, res) => {
    const { buildingID, buildingType } = req.body;
    const insertResult = await appService.insertStorageBuilding(buildingID, buildingType);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


// Machinery
router.post("/initiate-machinery-table", async (req, res) => {
    const initiateResult = await appService.initiateMachineryTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/get-machinery-table', async (req, res) => {
    const tableContent = await appService.fetchMachineryTableFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-machinery-table", async (req, res) => {
    const { MachineID, mType, Condition } = req.body;
    const insertResult = await appService.insertMachineryTable(MachineID, mType, Condition);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/get-group-machinery-by-condition", async (req, res) => {
    const tableContent = await appService.groupMachineryByCondition();
    res.json({ data: tableContent })
});

router.get('/group-transaction-having', async (req, res) => {
    const minTotal = parseFloat(req.query.minTotal || '0');
    const result = await appService.groupTransactionHavingAmount(minTotal);
    res.json({ data: result });
});


// PRODUCTS

router.get('/get-egg-products', async (req, res) => {
    const tableContent = await appService.fetchEggProductsFromDb();
    res.json({ data: tableContent });
});

router.get('/get-dairy-products', async (req, res) => {
    const tableContent = await appService.fetchDairyProductsFromDb();
    res.json({ data: tableContent });
});

router.get('/get-crop-products', async (req, res) => {
    const tableContent = await appService.fetchCropProductsFromDb();
    res.json({ data: tableContent });
});

// FARM MANAGEMENT END **********************************************************************************************************


router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});


module.exports = router;