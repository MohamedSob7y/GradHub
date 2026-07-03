-- Enable TCP/IP via xp_cmdshell (requires sysadmin)
-- Run this from an Administrator PowerShell or enable TCP manually via SQL Server Configuration Manager
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
