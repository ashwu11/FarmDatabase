/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// FARM MANAGEMENT **********************************************************************************************************

//Customer

// This function resets or initializes the Customer table.
async function resetCustomerTable() {
    const response = await fetch("/initiate-customer-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetCustomerMsg');
        messageElement.textContent = "Customer table initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating Customer table!");
    }
}

// Fetches data from the Customer table and displays it.
async function fetchAndDisplayCustomers() {
    const tableElement = document.getElementById('customerTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-customer-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const customerTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    customerTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new records into the Customer table.
async function insertCustomerTable(event) {
    event.preventDefault();

    const emailValue = document.getElementById('insertCustomerEmail').value;
    const nameValue = document.getElementById('insertCustomerName').value;
    const phoneNumberValue = document.getElementById('insertCustomerPhoneNumber').value;

    console.log("Inserting:", { emailValue, nameValue, phoneNumberValue });

    const response = await fetch('/insert-customer-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailValue,
            name: nameValue,
            phoneNumber: phoneNumberValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertCustomerMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

//Farmer

// This function resets or initializes the Farmer table.
async function resetFarmerTable() {
    const response = await fetch("/initiate-farmer-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetFarmerMsg');
        messageElement.textContent = "Farmer table initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating Farmer table!");
    }
}

// Fetches data from the Farmer table and displays it.
async function fetchAndDisplayFarmers() {
    const tableElement = document.getElementById('farmerTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-farmer-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const farmerTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    farmerTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new records into the Farmer table.
async function insertFarmerTable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertFarmerID').value;
    const nameValue = document.getElementById('insertFarmerName').value;
    const phoneNumberValue = document.getElementById('insertFarmerPhoneNumber').value;

    console.log("Inserting:", { idValue, nameValue, phoneNumberValue });

    const response = await fetch('/insert-farmer-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue,
            phoneNumber: phoneNumberValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertFarmerMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function updateFarmerInfo(event) {
    event.preventDefault();

    const farmerID = document.getElementById('farmerID').value;
    const newFarmerName = document.getElementById('updateFarmerName').value;
    const newFarmerNumber = document.getElementById('updateFarmerPhoneNumber').value;

    console.log(`Updating farmer info: ${farmerID} -> ${newFarmerName} | ${newFarmerNumber}`);

    const response = await fetch('/update-farmer-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            farmerID: farmerID,
            newName: newFarmerName,
            newNumber: newFarmerNumber
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateFarmerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Farmer Info updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating Farmer Info!";
    }
}

async function deleteFarmerInfo(event) {
    event.preventDefault();

    const farmerID = document.getElementById("deleteFarmerID").value;
    console.log(`Deleting farmer with id: ${farmerID}`);

    const response = await fetch('/delete-farmer-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            farmerID: farmerID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteFarmerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Farmer Info deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting Farmer!";
    }
}


// SHIFTS

// This function resets or initializes the Shifts table.
async function resetShiftTable() {
    const response = await fetch("/initiate-shift-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetShiftMsg');
        messageElement.textContent = "Shift table initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating Shift table!");
    }
}

// Fetches data from the Shift table and displays it.
async function fetchAndDisplayShifts() {
    const tableElement = document.getElementById('shiftTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-shift-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const shiftTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    shiftTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);

            if (index === 1) {
                const rawDate = new Date(field);
                const formattedDate = rawDate.toISOString().split('T')[0];
                cell.textContent = formattedDate;
            } else {
                cell.textContent = field;
            }

        });
    });
}

// Inserts new records into the Shift table.
async function insertShiftTable(event) {
    event.preventDefault();

    const farmerIDValue = document.getElementById('insertShiftFarmerID').value;
    const dateValue = document.getElementById('insertDate').value;

    console.log("Inserting:", { farmerIDValue, dateValue });

    const response = await fetch('/insert-shift-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            FarmerID: farmerIDValue,
            sDate: dateValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertShiftMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function fetchAndDisplayShiftAndFarmerInfoByDate(date) {
    const tableBody = document.querySelector('#farmerInfoTable tbody');

    const response = await fetch('/get-shift-farmer-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sDate: date })
    });

    const result = await response.json();
    const data = result.data;

    tableBody.innerHTML = '';

    data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach(cellValue => {
            const td = tr.insertCell();
            td.textContent = cellValue;
        });
    });
}

function filterShiftByDate() {
    const date = document.getElementById('filterShiftDate').value;
    if (date) {
        fetchAndDisplayShiftAndFarmerInfoByDate(date);
    }
}

// Transactions

// This function resets or initializes the Transactions table.
async function resetTransactionsTable() {
    const response = await fetch("/initiate-transactions-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetTransactionsMsg');
        messageElement.textContent = "Transactions table initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating Transactions table!");
    }
}

// Fetches data from the Transactions table and displays it.
async function fetchAndDisplayTransactions() {
    const tableElement = document.getElementById('transactionTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-transactions-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const transactionTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    transactionTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);

            if (index === 2) {
                const rawDate = new Date(field);
                const formattedDate = rawDate.toISOString().split('T')[0];
                cell.textContent = formattedDate;
            } else {
                cell.textContent = field;
            }
        });
    });
}

// Inserts new records into the Transactions table.
async function insertTransactionsTable(event) {
    event.preventDefault();

    const transactionNumberValue = document.getElementById('insertTransactionNumber').value;
    const cEmailValue = document.getElementById('insertTransactionCustomerEmail').value;
    const tDateValue = document.getElementById('insertTransactionDate').value;
    const TotalValue = document.getElementById('insertTransactionTotal').value;

    console.log("Inserting:", { transactionNumberValue, cEmailValue, tDateValue, TotalValue });

    const response = await fetch('/insert-transactions-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            TransactionNumber: transactionNumberValue,
            cEmail: cEmailValue,
            tDate: tDateValue,
            Total: TotalValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertTransactionMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function fetchAndDisplayProjectedTransactions() {
    const checkboxes = document.querySelectorAll('input[name="columns"]:checked');
    const selectedColumns = Array.from(checkboxes).map(cb => cb.value);

    const response = await fetch('/project-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: selectedColumns })
    });

    const data = (await response.json()).data;

    const table = document.getElementById('transactionTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '';
    const headerRow = thead.insertRow();

    const columnDisplayNames = {
        TransactionNumber: "Transaction Number",
        cEmail: "Customer Email",
        tDate: "Date",
        Total: "Total Sale Amount"
    };

    selectedColumns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = columnDisplayNames[col] || col;
        headerRow.appendChild(th);
    });

    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = tbody.insertRow();

        row.forEach((cell, index) => {
            const td = tr.insertCell();
            const colName = selectedColumns[index];
            if (colName === "tDate") {
                const rawDate = new Date(cell);
                td.textContent = rawDate.toISOString().split('T')[0];
            } else {
                td.textContent = cell;
            }
        });
    });
}

// STORAGE BUILDING

// Fetches data from the StorageBuilding table and displays it
async function fetchAndDisplayBuildings() {
    const tableElement = document.getElementById('storageBuildingTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/storage-building-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const storageBuildingTableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    storageBuildingTableContent.forEach(building => {
        const row = tableBody.insertRow();
        building.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the StorageBuilding table
async function resetStorageBuildingTable() {
    const response = await fetch("/initiate-storage-building-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetStorageBuildingMsg');
        messageElement.textContent = "Storage Building table initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the StorageBuilding table
async function insertStorageBuildingTable(event) {
    event.preventDefault();

    const buildingID = document.getElementById('insertBuildingID').value;
    const buildingType = document.getElementById('insertBuildingType').value;

    const response = await fetch('/insert-storage-building', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            buildingID: buildingID,
            buildingType: buildingType
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertStorageBuildingMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

//Machinery

// This function resets or initializes the Machinery table.
async function resetMachineryTable() {
    const response = await fetch("/initiate-machinery-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetMachineryMsg');
        messageElement.textContent = "Machinery table initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating Machinery table!");
    }
}

// Fetches data from the Machinery table and displays it.
async function fetchAndDisplayMachines() {
    const tableElement = document.getElementById('machineryTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-machinery-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const machineryTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    machineryTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new records into the Machinery table.
async function insertMachineryTable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertMachineID').value;
    const typeValue = document.getElementById('insertMachineType').value;
    const conditionValue = document.getElementById('insertMachineCondition').value;

    console.log("Inserting:", { idValue, typeValue, conditionValue });

    const response = await fetch('/insert-machinery-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            MachineID: idValue,
            mType: typeValue,
            Condition: conditionValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertMachineryMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}


async function fetchGroupedMachineryByCondition() {
    const tableBody = document.querySelector('#machineryConditionGroupTable tbody');

    try {
        const response = await fetch("/get-group-machinery-by-condition");
        const data = await response.json();

        if (!data.data) throw new Error("Fetch failed");

        tableBody.innerHTML = '';

        data.data.forEach(([condition, count]) => {
            const row = tableBody.insertRow();
            const conditionCell = row.insertCell();
            const countCell = row.insertCell();

            conditionCell.textContent = condition;
            countCell.textContent = count;
        });
    } catch (error) {
        console.error("Error fetching grouped machinery data:", error);
    }
}

async function fetchGroupedTransactionByAmountWithInput() {
    const minTotalInput = document.getElementById("minTotalInput").value;

    try {
        const response = await fetch(`/group-transaction-having?minTotal=${minTotalInput}`);
        const data = await response.json();

        const tableBody = document.getElementById('transactionGroupByAmountTable').querySelector('tbody');
        tableBody.innerHTML = '';

        data.data.forEach(([tDate, totalSum]) => {
            const row = tableBody.insertRow();
            const dateCell = row.insertCell();
            const totalCell = row.insertCell();

            const formattedDate = new Date(tDate).toISOString().split('T')[0];
            dateCell.textContent = formattedDate;
            totalCell.textContent = totalSum;
        });
    } catch (err) {
        console.error("Error fetching grouped transaction data:", err);
    }
}

// PRODUCTS

async function fetchAndDisplayEggProducts() {
    const tableElement = document.getElementById('eggProducts');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-egg-products', {
        method: 'GET'
    });

    const responseData = await response.json();
    const eggProducts = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    eggProducts.forEach(egg => {
        const row = tableBody.insertRow();
        egg.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index === 2) {
                const rawDate = new Date(field);
                const formattedDate = rawDate.toISOString().split('T')[0];
                cell.textContent = formattedDate;
            } else {
                cell.textContent = field;
            }
        });
    });
}




async function fetchAndDisplayDairyProducts() {
    const tableElement = document.getElementById('dairyProducts');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-dairy-products', {
        method: 'GET'
    });

    const responseData = await response.json();
    const dairyProducts = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    dairyProducts.forEach(dairy => {
        const row = tableBody.insertRow();
        dairy.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index === 3) {
                const rawDate = new Date(field);
                const formattedDate = rawDate.toISOString().split('T')[0];
                cell.textContent = formattedDate;
            } else {
                cell.textContent = field;
            }
        });
    });
}



async function fetchAndDisplayCropProducts() {
    const tableElement = document.getElementById('cropProducts');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-crop-products', {
        method: 'GET'
    });

    const responseData = await response.json();
    const cropProducts = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    cropProducts.forEach(crop => {
        const row = tableBody.insertRow();
        crop.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index === 3 || index === 4) {
                const rawDate = new Date(field);
                const formattedDate = rawDate.toISOString().split('T')[0];
                cell.textContent = formattedDate;
            } else {
                cell.textContent = field;
            }
        });
    });
}

// ANIMAL

async function fetchAndDisplayAnimalTable() {
    const tableElement = document.getElementById('animalTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-animal-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const animalTable = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    animalTable.forEach(animal => {
        const row = tableBody.insertRow();
        animal.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = typeof field === 'number' ? parseFloat(field).toFixed(2) : field;
        });
    });
}

function addCondition() {
    const attributes = ["AnimalID", "aName", "Age", "PenNumber", "Weight"];
    const operators = ["=", ">", "<", ">=", "<=", "LIKE"];

    let conditionHTML = `
        <div class="condition">
            <select class="logic">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
            
            <select class="attribute">
                ${attributes.map(attr => `<option value="${attr}">${attr}</option>`).join("")}
            </select>

            <select class="operator">
                ${operators.map(op => `<option value="${op}">${op}</option>`).join("")}
            </select>

            <input type="text" class="value" placeholder="Enter value">
            <button type="button" onclick="removeCondition(this)">Remove</button>
        </div>
    `;
    document.getElementById("animalSearchConditions").insertAdjacentHTML("beforeend", conditionHTML);
}

function removeCondition(button) {
    button.parentElement.remove();
}

async function selectAnimals(event) {
    event.preventDefault();

    const conditions = [];
    document.querySelectorAll(".condition").forEach((condition, index) => {
        const attr = condition.querySelector(".attribute").value;
        const op = condition.querySelector(".operator").value;
        const val = condition.querySelector(".value").value;
        const logic = index === 0 ? "" : condition.querySelector(".logic").value;
        const formattedVal = isNaN(val) ? `'${val}'` : val;

        conditions.push(`${logic} ${attr} ${op} ${formattedVal}`);
    });

    const queryClause = conditions.join(" ");
    console.log(queryClause);

    try {
        const response = await fetch("/select-animals", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clauses: queryClause
            })
        });

        console.log(response);
        const responseData = await response.json();
        displayAnimalResults(responseData.data);
    } catch (err) {
        console.error(err);
        document.getElementById('animalResults').textContent = "Error fetching data :(";
    }
}

function displayAnimalResults(data) {
    const messageElement = document.getElementById('animalResults');
    const tableElement = document.getElementById('animals');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if (data.length === 0) {
        messageElement.textContent = "No Results Found :(";
        return;
    }

    data.forEach(animal => {
        const row = tableBody.insertRow();
        animal.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = typeof field === 'number' ? parseFloat(field).toFixed(2) : field;
        });
    });

    messageElement.textContent = "Search Successful!";
}

async function fetchAndDisplayCows() {
    const tableElement = document.getElementById('cowAnimals');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-cow-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const cows = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    cows.forEach(cow => {
        const row = tableBody.insertRow();
        cow.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = typeof field === 'number' ? parseFloat(field).toFixed(2) : field;
        });
    });
}

async function findUnderweightCows() {
    try {
        const response = await fetch("/count-underweight-cows");
        const data = await response.json();

        document.getElementById('underWeightCows').textContent = `Underweight cows count: ${data.count}`;
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('underWeightCows').textContent = "Error fetching data :(";
    }
}

async function fetchAndDisplayChickens() {
    const tableElement = document.getElementById('chickenAnimals');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-chicken-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const chickens = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    chickens.forEach(chicken => {
        const row = tableBody.insertRow();
        chicken.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = typeof field === 'number' ? parseFloat(field).toFixed(2) : field;
        });
    });
}


// rest of tables 


async function fetchAndDisplayCropMaintenanceTable() {
    const tableElement = document.getElementById('cropMaintenanceTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-crop-maintenance-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const cropMaintenanceTable = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    cropMaintenanceTable.forEach(log => {
        const row = tableBody.insertRow();
        log.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index === 2) {
                const rawDate = new Date(field);
                const formattedDate = rawDate.toISOString().split('T')[0];
                cell.textContent = formattedDate;
            } else {
                cell.textContent = field;
            }
        });
    });
}




async function fetchAndDisplayAnimalFeedingLogTable() {
    const tableElement = document.getElementById('feedingLogTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-animal-feeding-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const feedingLogTable = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    feedingLogTable.forEach(log => {
        const row = tableBody.insertRow();
        log.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (index === 2) {
                const rawDate = new Date(field);
                const formattedDate = rawDate.toISOString().split('T')[0];
                cell.textContent = formattedDate;
            } else {
                cell.textContent = field;
            }
        });
    });
}





async function fetchAndDisplayPurchasedProductsTable() {
    const tableElement = document.getElementById('purchasedProductsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-purchased-products-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const purchasedProductsTable = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    purchasedProductsTable.forEach(purchasedProduct => {
        const row = tableBody.insertRow();
        purchasedProduct.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function findSuperFarmers() {
    try {
        // Fetch the data from the backend endpoint
        const response = await fetch("/find-super-farmers"); // Use the appropriate endpoint
        const data = await response.json();

        // Get the table body element
        const tableBody = document.querySelector('#farmerDivisionTable tbody');

        // Clear the existing rows (if any)
        tableBody.innerHTML = '';

        // If no farmers are found, display a message
        if (data.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 2;
            cell.textContent = "No super qualified farmers found.";
            return;
        }

        // Populate the table with the fetched farmer data
        data.forEach(farmer => {
            const row = tableBody.insertRow();
            const farmerIdCell = row.insertCell();
            const farmerNameCell = row.insertCell();

            farmerIdCell.textContent = farmer.FarmerID;  // Assuming `farmerId` is part of the response
            farmerNameCell.textContent = farmer.fName;  // Assuming `farmerName` is part of the response
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('farmerDivision').textContent = "Error fetching data :(";
    }
}

// FARM MANAGEMENT END **********************************************************************************************************

// SAMPLE PROJECT STARTS HERE

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);

    document.getElementById("resetCustomerTable").addEventListener("click", resetCustomerTable);
    document.getElementById("insertCustomerTable").addEventListener("submit", insertCustomerTable);

    document.getElementById("resetFarmerTable").addEventListener("click", resetFarmerTable);
    document.getElementById("insertFarmerTable").addEventListener("submit", insertFarmerTable);
    document.getElementById("updateFarmerInfo").addEventListener("submit", updateFarmerInfo);
    document.getElementById("deleteFarmerInfo").addEventListener("submit", deleteFarmerInfo);

    document.getElementById("resetShiftTable").addEventListener("click", resetShiftTable);
    document.getElementById("insertShiftTable").addEventListener("submit", insertShiftTable);

    document.getElementById("filterShiftDate").addEventListener("change", filterShiftByDate);

    document.getElementById("resetTransactionsTable").addEventListener("click", resetTransactionsTable);
    document.getElementById("insertTransactionsTable").addEventListener("submit", insertTransactionsTable);

    document.getElementById("resetStorageBuildingTable").addEventListener("click", resetStorageBuildingTable);
    document.getElementById("insertStorageBuilding").addEventListener("submit", insertStorageBuildingTable);

    document.getElementById("resetMachineryTable").addEventListener("click", resetMachineryTable);
    document.getElementById("insertMachineryTable").addEventListener("submit", insertMachineryTable);

    document.getElementById("groupByConditionBtn").addEventListener("click", fetchGroupedMachineryByCondition);

    document.getElementById("groupByTransactionAmountBtn").addEventListener("click", fetchGroupedTransactionByAmountWithInput);

    document.getElementById("animalSearchForm").addEventListener("submit", selectAnimals);

    document.getElementById("countUnderweightCowsBtn").addEventListener("click", findUnderweightCows);

    document.getElementById("farmerDivisionBtn").addEventListener("click", findSuperFarmers);

};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayCustomers();
    fetchAndDisplayFarmers();
    fetchAndDisplayShifts();
    fetchAndDisplayTransactions();
    fetchAndDisplayBuildings();
    fetchAndDisplayMachines();
    fetchAndDisplayEggProducts();
    fetchAndDisplayDairyProducts();
    fetchAndDisplayCropProducts();
    fetchAndDisplayCows();
    fetchAndDisplayChickens();
    fetchAndDisplayAnimalTable();
    fetchAndDisplayCropMaintenanceTable();
    fetchAndDisplayAnimalFeedingLogTable();
    fetchAndDisplayPurchasedProductsTable();
}