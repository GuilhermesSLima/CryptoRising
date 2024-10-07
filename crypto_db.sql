CREATE DATABASE IF NOT EXISTS crypto_db;

use crypto_db;

CREATE TABLE criptomoedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    simbolo VARCHAR(10),
    valor DECIMAL(20, 10),
    data_registro DATE
);
