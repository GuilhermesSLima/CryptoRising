<?php
// Conexão com o banco de dados
$servername = "localhost";
$username = "root"; // seu usuário do banco de dados
$password = "";     // sua senha do banco de dados
$dbname = "crypto_db"; // nome do banco de dados

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verifica se a requisição é para salvar dados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $moeda = $_POST['moeda'];
    $valor = $_POST['valor'];

    // Insere a moeda e valor no banco de dados
    $sql = "INSERT INTO criptomoedas (moeda, valor, data_registro) VALUES ('$moeda', '$valor', NOW())";
    if ($conn->query($sql) === TRUE) {
        echo "Dados de $moeda salvos com sucesso!";
    } else {
        echo "Erro: " . $sql . "<br>" . $conn->error;
    }
}

// Código para apagar dados antigos após 3 dias
if (isset($_GET['delete']) && $_GET['delete'] === 'true') {
    $sql = "DELETE FROM criptomoedas WHERE data_registro < NOW() - INTERVAL 3 DAY";
    if ($conn->query($sql) === TRUE) {
        echo "Dados antigos apagados com sucesso!";
    } else {
        echo "Erro ao apagar dados: " . $conn->error;
    }
}

$conn->close();
?>
