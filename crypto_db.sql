CREATE DATABASE IF NOT EXISTS crypto_db;

use crypto_db;

CREATE TABLE crypto_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coin_id VARCHAR(255) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    UNIQUE(coin_id, date)
);

ALTER TABLE crypto_prices
MODIFY date DATETIME NOT NULL;

SELECT * from crypto_db.crypto_prices limit 10000;