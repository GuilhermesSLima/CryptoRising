<?php
// Configurações do banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crypto_db";

// Conectar ao banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Consultar os valores das criptomoedas de hoje, ontem e dois dias atrás
$sql = "SELECT nome, simbolo, valor, data_registro FROM criptomoedas 
        WHERE data_registro IN (
            CURDATE(),
            CURDATE() - INTERVAL 1 DAY,
            CURDATE() - INTERVAL 2 DAY
        )";
        
$result = $conn->query($sql);

$criptomoedas = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $criptomoedas[] = $row;
    }
}

echo json_encode($criptomoedas);

$conn->close();
?>
