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

// API de criptomoedas (usando CoinPaprika)
$apiUrl = "https://api.coinpaprika.com/v1/tickers";

// Fazer a requisição à API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

// Iterar sobre os dados e inserir no banco
foreach ($data as $coin) {
    $nome = $coin['name'];
    $simbolo = $coin['symbol'];
    $valor = $coin['quotes']['USD']['price'];
    $data_registro = date('Y-m-d'); // Registrar a data atual

    $sql = "INSERT INTO criptomoedas (nome, simbolo, valor, data_registro)
            VALUES ('$nome', '$simbolo', '$valor', '$data_registro')";

    if ($conn->query($sql) === TRUE) {
        echo "Registro inserido com sucesso: $nome ($simbolo)";
    } else {
        echo "Erro: " . $conn->error;
    }
}

$conn->close();
?>
