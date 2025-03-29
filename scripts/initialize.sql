

-- CHILD TABLES MUST BE DROPPED FIRST!!!
DROP TABLE PurchasedProducts;
DROP TABLE Transaction;
DROP TABLE CropMaintenance;
DROP TABLE Crop;
DROP TABLE MachineryUsage;
DROP TABLE AnimalFeedingLog;
DROP TABLE DairyRecords;
DROP TABLE EggRecords;
DROP TABLE Cow;
DROP TABLE Chicken;
DROP TABLE Shift;

-- Parent tables
DROP TABLE Products;
DROP TABLE Customer;
DROP TABLE Farmer;
DROP TABLE Machinery;
DROP TABLE Animal;
DROP TABLE StorageBuilding;

CREATE TABLE Customer (
    cEmail VARCHAR(200),
	cName VARCHAR(200),
	cPhoneNumber CHAR(200),
	PRIMARY KEY (cEmail)
);

CREATE TABLE Transaction (
	TransactionNumber INTEGER,
	cEmail VARCHAR(200) NOT NULL,
	tDate DATE,
	Total DECIMAL(10, 2),
	PRIMARY KEY (TransactionNumber),
	FOREIGN KEY (cEmail) REFERENCES Customer(cEmail)
    ON DELETE CASCADE
);

CREATE TABLE Products (
	BatchID INTEGER,
	Yield INTEGER,
	CollectionDate DATE,
	PRIMARY KEY (BatchID)
);

CREATE TABLE PurchasedProducts (
	BatchID INTEGER,
	TransactionNumber INTEGER,
	PRIMARY KEY (BatchID, TransactionNumber),
    FOREIGN KEY (BatchID) REFERENCES Products(BatchID)
        ON DELETE CASCADE,
	FOREIGN KEY (TransactionNumber) REFERENCES Transaction(TransactionNumber)
        ON DELETE CASCADE
);

CREATE TABLE Farmer (
	FarmerID INTEGER,
    fName VARCHAR(200),
    fPhoneNumber VARCHAR(200),
    PRIMARY KEY (FarmerID)
);

CREATE TABLE Shift (
	FarmerID INTEGER,
	sDate DATE,
	PRIMARY KEY (FarmerID, sDate),
	FOREIGN KEY (FarmerID) REFERENCES Farmer(FarmerID)
    ON DELETE CASCADE
);

CREATE TABLE StorageBuilding (
	BuildingID INTEGER,
	sbType VARCHAR(200),
	PRIMARY KEY (BuildingID)
);

CREATE TABLE Crop (
	BatchID INTEGER,
	crType VARCHAR(200), 
	PlantDate DATE,
	BuildingID INTEGER,
	PRIMARY KEY (BatchID),
	FOREIGN KEY (BatchID) REFERENCES Products(BatchID)
        ON DELETE CASCADE,
	FOREIGN KEY (BuildingID) REFERENCES StorageBuilding(BuildingID)
        ON DELETE SET NULL
);

CREATE TABLE CropMaintenance (
	TasksCompleted VARCHAR(200),
	FarmerID INTEGER,
	sDate DATE,
	BatchID INTEGER,
	PRIMARY KEY (FarmerID, sDate, BatchID),
	FOREIGN KEY (FarmerID, sDate) REFERENCES Shift(FarmerID, sDate)
        ON DELETE CASCADE,
	FOREIGN KEY (BatchID) REFERENCES Crop(BatchID)
        ON DELETE SET NULL
);

CREATE TABLE Machinery (
	MachineID INTEGER,
	mType VARCHAR(200), 
	Condition VARCHAR(200),
	PRIMARY KEY (MachineID)
);

CREATE TABLE MachineryUsage (
	FarmerID INTEGER,
	MachineID INTEGER,
	sDate DATE,
	PRIMARY KEY (FarmerID, sDate, MachineID),
	FOREIGN KEY (FarmerID, sDate) REFERENCES Shift(FarmerID, sDate)
        ON DELETE SET NULL,
	FOREIGN KEY (MachineID) REFERENCES Machinery(MachineID)
        ON DELETE CASCADE
);

CREATE TABLE Animal (
	AnimalID INTEGER,
	aName VARCHAR(200),
	Age INTEGER,
	PenNumber INTEGER,
	Weight DECIMAL(10, 2),
	PRIMARY KEY (AnimalID)
);

CREATE TABLE AnimalFeedingLog (
	FarmerID INTEGER,
	AnimalID INTEGER,
	sDate DATE,
	PRIMARY KEY (FarmerID, sDate, AnimalID),
	FOREIGN KEY (FarmerID, sDate) REFERENCES Shift(FarmerID, sDate)
        ON DELETE SET NULL,
	FOREIGN KEY (AnimalID) REFERENCES Animal(AnimalID)
        ON DELETE CASCADE
);

CREATE TABLE Cow (
	AnimalID INTEGER,
	PRIMARY KEY (AnimalID),
	FOREIGN KEY (AnimalID) REFERENCES Animal(AnimalID)
        ON DELETE CASCADE
);

CREATE TABLE DairyRecords (
	BatchID INTEGER,
	dType VARCHAR(200),
	AnimalID INTEGER NOT NULL,
	BuildingID INTEGER,
	PRIMARY KEY (BatchID),
	FOREIGN KEY (BatchID) REFERENCES Products(BatchID)
        ON DELETE CASCADE,
	FOREIGN KEY (AnimalID) REFERENCES Cow(AnimalID)
        ON DELETE SET NULL,
    FOREIGN KEY (BuildingID) REFERENCES StorageBuilding(BuildingID)
        ON DELETE SET NULL
);

CREATE TABLE Chicken (
	AnimalID INTEGER,
	PRIMARY KEY (AnimalID),
	FOREIGN KEY (AnimalID) REFERENCES Animal(AnimalID)
        ON DELETE CASCADE
);

CREATE TABLE EggRecords (
	BatchID INTEGER,
	AnimalID INTEGER NOT NULL,
	BuildingID INTEGER,
	PRIMARY KEY (BatchID),
	FOREIGN KEY (BatchID) REFERENCES Products(BatchID)
        ON DELETE CASCADE,
	FOREIGN KEY (AnimalID) REFERENCES Chicken(AnimalID)
        ON DELETE SET NULL,
	FOREIGN Key (BuildingID) REFERENCES StorageBuilding(BuildingID)
        ON DELETE SET NULL
);

---------Parent tables----------

INSERT INTO Farmer VALUES (100, 'Jerry Jam', '778-333-9898');
INSERT INTO Farmer VALUES (101, 'Carrey Nicol', '778-541-6312');
INSERT INTO Farmer VALUES (102, 'Richelle Peters', '778-232-1431');
INSERT INTO Farmer VALUES (103, 'Tony Manning', '778-619-6543');
INSERT INTO Farmer VALUES (104, 'Peeta Parker', '778-691-4234');

INSERT INTO Customer VALUES ('janesmith93@gmail.com', 'Jane Smith', '604-122-3333');
INSERT INTO Customer VALUES ('masonyurb03@gmail.com', 'Mason Yurb', '778-322-3992');
INSERT INTO Customer VALUES ('romantaurk87@gmail.com', 'Roman Taurk', '778-981-6432');
INSERT INTO Customer VALUES ('rbauli22@gmail.com', 'Raiya Bauli', '604-261-0184');
INSERT INTO Customer VALUES ('parmkarla84@gmail.com', 'Karla Parm', '604-918-3651');

INSERT INTO Animal VALUES (300, 'Pecky', 8, 121, 2.42);
INSERT INTO Animal VALUES (301, 'Snoopy', 4, 123, 505.45);
INSERT INTO Animal VALUES (302, 'Woodstock', 4, 123, 2.75);
INSERT INTO Animal VALUES (303, 'Mooshu', 10, 124, 484.84);
INSERT INTO Animal VALUES (304, 'Sir Loin', 15, 125, 575.25);
INSERT INTO Animal VALUES (305, 'Yolks', 3, 127, 1.66);
INSERT INTO Animal VALUES (306, 'Mooana', 12, 128, 468.32);
INSERT INTO Animal VALUES (307, 'Feathers', 8, 125, 1.81);
INSERT INTO Animal VALUES (308, 'Clucks', 6, 130, 3.03);
INSERT INTO Animal VALUES (309, 'Milkshake', 11, 133, 625.75);

INSERT INTO StorageBuilding VALUES (100, 'Egg Cellar');
INSERT INTO StorageBuilding VALUES (101, 'Milk House');
INSERT INTO StorageBuilding VALUES (102, 'Butter Place');
INSERT INTO StorageBuilding VALUES (103, 'Feed Shed');
INSERT INTO StorageBuilding VALUES (104, 'Crop Silo');

INSERT INTO Machinery VALUES (1, 'Tractor', 'Fair');
INSERT INTO Machinery VALUES (2, 'Planter','Good');
INSERT INTO Machinery VALUES (3, 'Solar Panel','New');
INSERT INTO Machinery VALUES (4, 'Weeding Machine', 'Needs Repair');
INSERT INTO Machinery VALUES (5, 'Compost Machine','Poor');

-------------------------- END parent tables

INSERT INTO Shift VALUES (100, TO_DATE('2024-05-12', 'YYYY-MM-DD'));
INSERT INTO Shift VALUES (101, TO_DATE('2025-01-22', 'YYYY-MM-DD'));
INSERT INTO Shift VALUES (102, TO_DATE('2025-01-23', 'YYYY-MM-DD'));
INSERT INTO Shift VALUES (100, TO_DATE('2025-01-24', 'YYYY-MM-DD'));
INSERT INTO Shift VALUES (103, TO_DATE('2025-01-24', 'YYYY-MM-DD'));

INSERT INTO MachineryUsage VALUES (100, 1, TO_DATE('2024-05-12', 'YYYY-MM-DD'));
INSERT INTO MachineryUsage VALUES (101, 3, TO_DATE('2025-01-22', 'YYYY-MM-DD'));
INSERT INTO MachineryUsage VALUES (102, 4, TO_DATE('2025-01-23', 'YYYY-MM-DD'));
INSERT INTO MachineryUsage VALUES (100, 5, TO_DATE('2025-01-24', 'YYYY-MM-DD'));
INSERT INTO MachineryUsage VALUES (103, 2, TO_DATE('2025-01-24', 'YYYY-MM-DD'));

INSERT INTO Chicken VALUES (300);
INSERT INTO Chicken VALUES (302);
INSERT INTO Chicken VALUES (305);
INSERT INTO Chicken VALUES (307);
INSERT INTO Chicken VALUES (308); 

INSERT INTO Cow VALUES (301);   
INSERT INTO Cow VALUES (303);
INSERT INTO Cow VALUES (304);
INSERT INTO Cow VALUES (306);
INSERT INTO Cow VALUES (309);

INSERT INTO AnimalFeedingLog VALUES (100, 300, TO_DATE('2024-05-12', 'YYYY-MM-DD'));
INSERT INTO AnimalFeedingLog VALUES (101, 301, TO_DATE('2025-01-22', 'YYYY-MM-DD'));
INSERT INTO AnimalFeedingLog VALUES (102, 302, TO_DATE('2025-01-23', 'YYYY-MM-DD'));
INSERT INTO AnimalFeedingLog VALUES (100, 303, TO_DATE('2025-01-24', 'YYYY-MM-DD'));
INSERT INTO AnimalFeedingLog VALUES (103, 304, TO_DATE('2025-01-24', 'YYYY-MM-DD'));

INSERT INTO Products VALUES (101, 150, TO_DATE('2025-01-15', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (102, 60, TO_DATE('2025-02-03', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (103, 220, TO_DATE('2025-02-10', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (104, 77, TO_DATE('2025-02-20', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (105, 345, TO_DATE('2025-02-28', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (106, 80, TO_DATE('2025-01-17', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (107, 250, TO_DATE('2025-02-05', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (108, 90, TO_DATE('2025-03-10', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (109, 170, TO_DATE('2025-02-22', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (110, 125, TO_DATE('2025-08-28', 'YYYY-MM-DD'));	
INSERT INTO Products VALUES (111, 64, TO_DATE('2025-01-15', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (112, 205, TO_DATE('2025-02-02', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (113, 95, TO_DATE('2025-09-15', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (114, 144, TO_DATE('2025-01-22', 'YYYY-MM-DD'));
INSERT INTO Products VALUES (115, 78, TO_DATE('2025-05-25', 'YYYY-MM-DD'));

INSERT INTO DairyRecords VALUES (101, 'Milk', 303, 101);
INSERT INTO DairyRecords VALUES (103, 'Milk', 304, 101);
INSERT INTO DairyRecords VALUES (105, 'Butter', 304, 102);
INSERT INTO DairyRecords VALUES (107, 'Butter', 306, 102);
INSERT INTO DairyRecords VALUES (109, 'Milk', 309, 101);

INSERT INTO EggRecords VALUES (102, 300, 100);
INSERT INTO EggRecords VALUES (104, 307, 100);
INSERT INTO EggRecords VALUES (106, 307, 100);
INSERT INTO EggRecords VALUES (108, 308, 100);
INSERT INTO EggRecords VALUES (110, 308, 100);

INSERT INTO Crop VALUES (111, 'Corn', TO_DATE('2024-04-02', 'YYYY-MM-DD'), 104);
INSERT INTO Crop VALUES (112, 'Wheat', TO_DATE('2024-12-02', 'YYYY-MM-DD'), 104);
INSERT INTO Crop VALUES (113, 'Carrot', TO_DATE('2024-11-02', 'YYYY-MM-DD'), 104);
INSERT INTO Crop VALUES (114, 'Soybean', TO_DATE('2024-10-02', 'YYYY-MM-DD'), 104);
INSERT INTO Crop VALUES (115, 'Pumpkin', TO_DATE('2025-01-24', 'YYYY-MM-DD'), 104);
 
INSERT INTO CropMaintenance VALUES ('Watering and weeding', 100, TO_DATE('2024-05-12', 'YYYY-MM-DD'), 111);
INSERT INTO CropMaintenance VALUES ('Harvesting', 101, TO_DATE('2025-01-22', 'YYYY-MM-DD'), 112);
INSERT INTO CropMaintenance VALUES ('Spraying pesticides and thinning', 100, TO_DATE('2025-01-24', 'YYYY-MM-DD'), 113);
INSERT INTO CropMaintenance VALUES ('Harvesting', 102, TO_DATE('2025-01-23', 'YYYY-MM-DD'), 114);
INSERT INTO CropMaintenance VALUES ('Planting', 103, TO_DATE('2025-01-24', 'YYYY-MM-DD'), 115);

INSERT INTO Transaction VALUES (1, 'janesmith93@gmail.com', TO_DATE('2025-01-15', 'YYYY-MM-DD'), 1366.00);
INSERT INTO Transaction VALUES (2, 'masonyurb03@gmail.com', TO_DATE('2025-02-03', 'YYYY-MM-DD'), 289.99);
INSERT INTO Transaction VALUES (3, 'romantaurk87@gmail.com', TO_DATE('2025-02-10', 'YYYY-MM-DD'), 534.50);
INSERT INTO Transaction VALUES (4, 'rbauli22@gmail.com', TO_DATE('2025-02-20', 'YYYY-MM-DD'), 875.75);
INSERT INTO Transaction VALUES (5, 'parmkarla84@gmail.com', TO_DATE('2025-02-28', 'YYYY-MM-DD'), 425.25);

INSERT INTO PurchasedProducts VALUES (111, 1);
INSERT INTO PurchasedProducts VALUES (112, 2);
INSERT INTO PurchasedProducts VALUES (113, 3);
INSERT INTO PurchasedProducts VALUES (114, 4);
INSERT INTO PurchasedProducts VALUES (115, 5);

COMMIT;

















 