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
        const messageElement = document.getElementById('resetResultMsg');
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
    const messageElement = document.getElementById('insertResultMsg');

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
        const messageElement = document.getElementById('resetResultMsg');
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
    const messageElement = document.getElementById('insertResultMsg');

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
        const messageElement = document.getElementById('resetResultMsg');
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
    const typeValue = document.getElementById('insertType').value;
    const conditionValue = document.getElementById('insertCondition').value;

    console.log("Inserting:", { idValue, typeValue, conditionValue });

    const response = await fetch('/insert-machinery-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            type: typeValue,
            condition: conditionValue
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

// SHIFTS

// This function resets or initializes the Shifts table.
async function resetShiftTable() {
    const response = await fetch("/initiate-shift-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
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
    const messageElement = document.getElementById('insertResultMsg');

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
        const messageElement = document.getElementById('resetResultMsg');
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
    const messageElement = document.getElementById('insertResultMsg');

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

    document.getElementById("resetMachineryTable").addEventListener("click", resetMachineryTable);
    document.getElementById("insertMachineryTable").addEventListener("submit", insertMachineryTable);

    document.getElementById("resetShiftTable").addEventListener("click", resetShiftTable);
    document.getElementById("insertShiftTable").addEventListener("submit", insertShiftTable);

    document.getElementById("filterShiftDate").addEventListener("change", filterShiftByDate);

    document.getElementById("resetTransactionsTable").addEventListener("click", resetTransactionsTable);
    document.getElementById("insertTransactionsTable").addEventListener("submit", insertTransactionsTable);



};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayCustomers();
    fetchAndDisplayFarmers();
    fetchAndDisplayShifts();
    fetchAndDisplayTransactions();

}
