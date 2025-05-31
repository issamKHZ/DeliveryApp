CREATE TABLE UserTokensValidation (
	UserId INT PRIMARY KEY,
    EmailValidationToken NVARCHAR(255),
    PasswordResetToken NVARCHAR(255),
	EmailTokenExpiration DATETIME NULL,
	PasswordTokenExpiration DATETIME NULL,
    CONSTRAINT FK_UserTokens_User FOREIGN KEY (UserId) REFERENCES [User](Id) ON DELETE CASCADE
);