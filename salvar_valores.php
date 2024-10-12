<?php
$host = 'localhost';
$dbname = 'crypto_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Deleta dados com mais de 15 minutos
    $stmt = $pdo->prepare("DELETE FROM crypto_data WHERE date_collected < NOW() - INTERVAL 15 MINUTE");
    $stmt->execute();

    // URL da API da CoinPaprika
    $url = 'https://api.coinpaprika.com/v1/tickers';

    // Buscar dados da API
    $response = file_get_contents($url);
    $coins = json_decode($response, true);

    if (empty($coins)) {
        echo "Nenhuma moeda encontrada na API.";
        exit; // Saia do script se não houver dados
    }

    // Preparar inserção dos dados no banco
    $stmt = $pdo->prepare('INSERT INTO crypto_data (coin_id, name, symbol, price, market_cap, percent_change_24h) 
                           VALUES (:coin_id, :name, :symbol, :price, :market_cap, :percent_change_24h)');

    foreach ($coins as $coin) {
        // Verifica se os dados estão corretos antes de inserir
        var_dump($coin); // Verificar os dados que estão sendo inseridos

        $stmt->execute([
            ':coin_id' => $coin['id'],
            ':name' => $coin['name'],
            ':symbol' => $coin['symbol'],
            ':price' => $coin['quotes']['USD']['price'],
            ':market_cap' => $coin['quotes']['USD']['market_cap'],
            ':percent_change_24h' => $coin['quotes']['USD']['percent_change_24h']
        ]);
    }

    echo "Dados salvos com sucesso!";
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
