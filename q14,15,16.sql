--q14
CREATE USER IF NOT EXISTS 'store_manager'@'localhost'
IDENTIFIED BY 'password1234';

GRANT SELECT, INSERT, UPDATE
ON retial_store.*
TO 'store_manager'@'localhost';

--q15
REVOKE UPDATE
ON retial_store.*
FROM 'store_manager'@'localhost';

--q16
GRANT DELETE
ON retial_store.Sales
TO 'store_manager'@'localhost';

-- i excuted on xampp