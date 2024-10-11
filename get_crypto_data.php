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

// Definir as datas de hoje, ontem e dois dias atrás
$today = date('Y-m-d');
$yesterday = date('Y-m-d', strtotime('-1 day'));
$twoDaysAgo = date('Y-m-d', strtotime('-2 days'));

// Função para salvar ou atualizar os dados de uma moeda
function saveCryptoData($conn, $name, $symbol, $price, $date) {
    $stmt = $conn->prepare("REPLACE INTO criptomoedas (nome, simbolo, valor, data_registro) VALUES (?, ?, ?, ?)");
    if ($stmt === false) {
        die("Erro na preparação da query: " . $conn->error);
    }
    $stmt->bind_param("ssds", $name, $symbol, $price, $date);
    $stmt->execute();
    $stmt->close();
}

// Função para buscar dados da API CoinPaprika
function fetchCryptoData($coinId) {
    $url = "https://api.coinpaprika.com/v1/coins/$coinId/ohlcv/historical?start=" . date('Y-m-d', strtotime('-2 days')) . "&end=" . date('Y-m-d');
    $response = @file_get_contents($url);
    
    // Verificar se a resposta é válida
    if ($response === FALSE) {
        die("Erro ao acessar a API CoinPaprika");
    }
    
    $data = json_decode($response, true);

    // Verificar se a resposta é válida
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        die("Erro na decodificação dos dados da API: " . json_last_error_msg());
    }
    
    return $data;
}

// Lista de criptomoedas que você deseja monitorar
$coins = ['btc-bitcoin', 'eth-ethereum'];

foreach ($coins as $coinId) {
    $data = fetchCryptoData($coinId);

    foreach ($data as $dayData) {
        $date = date('Y-m-d', strtotime($dayData['time_open']));
        $price = $dayData['close'];
        $name = ucfirst(explode('-', $coinId)[1]); // Corrigido o nome
        $symbol = strtoupper(explode('-', $coinId)[0]); // Corrigido o símbolo

        // Salvar os dados no banco de dados
        saveCryptoData($conn, $name, $symbol, $price, $date);
    }
}

// Consultar os valores das criptomoedas de hoje, ontem e dois dias atrás
$sql = "SELECT nome, simbolo, valor, data_registro FROM criptomoedas 
        WHERE data_registro IN ('$today', '$yesterday', '$twoDaysAgo')";

$result = $conn->query($sql);

// Verificar se a consulta foi bem-sucedida
if ($result === false) {
    die("Erro na consulta ao banco de dados: " . $conn->error);
}

// Array para armazenar os resultados
$criptomoedas = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $criptomoedas[] = $row;
    }
}

// Retornar os dados como JSON
header('Content-Type: application/json');
echo json_encode($criptomoedas);

$conn->close();
?>
