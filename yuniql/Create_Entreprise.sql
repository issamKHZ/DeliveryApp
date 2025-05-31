CREATE TABLE Entreprise (
    Id INT PRIMARY KEY FOREIGN KEY REFERENCES [User](Id) ON DELETE CASCADE,
    CreationDate DATETIME NOT NULL, 
    SiretNumber VARCHAR(20) NULL,          
    RIB VARCHAR(34) NULL,                  
    ResponsibleName VARCHAR(100) NULL,            
    Address VARCHAR(200) NOT NULL,                    
    PostalCode VARCHAR(10) NOT NULL,                  
    City VARCHAR(100) NOT NULL,                       
    Country VARCHAR(100) NOT NULL,                    
    Description NVARCHAR(MAX) NULL,                   
    ActivitySector VARCHAR(100) NULL              
);
