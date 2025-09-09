CREATE TABLE Collections_Type (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(100) NOT NULL, 
    Label NVARCHAR(255) NULL           
);

CREATE TABLE Collection_Items (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(100) NOT NULL, 
    Label NVARCHAR(255) NULL,      
    Collection_Id INT NOT NULL,

    CONSTRAINT FK_CollectionItems_CollectionTypes 
        FOREIGN KEY (Collection_Id) REFERENCES Collections_Type(Id)
        ON DELETE CASCADE
);