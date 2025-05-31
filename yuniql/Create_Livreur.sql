CREATE TABLE Livreur (
    Id INT PRIMARY KEY FOREIGN KEY REFERENCES [User](Id) ON DELETE CASCADE,
    CreationDate DATETIME NOT NULL, 
    FirstName VARCHAR(250) NOT NULL,
	LastName VARCHAR(250) NOT NULL,
    RIB VARCHAR(34) NULL,                      
    Address VARCHAR(200) NULL,                    
    PostalCode VARCHAR(10) NULL,                  
    City VARCHAR(100) NULL,                       
    Country VARCHAR(100) NULL, 
	Age INT NOT NULL,
	VehicleType VARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX) NULL,                       
);
