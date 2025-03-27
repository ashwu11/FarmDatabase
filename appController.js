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