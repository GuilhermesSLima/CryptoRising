<?php
$host = 'localhost';
$dbname = 'crypto_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recebe o id da moeda a ser exibida
    $coinId = $_GET['coin_id'];

    // Verifica se já existe um registro para o dia atual
    $today = date('Y-m-d');
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM crypto_prices WHERE coin_id = :coin_id AND date = :today");
    $stmt->execute(['coin_id' => $coinId, 'today' => $today]);
    $count = $stmt->fetchColumn();

    // Se não há registro para o dia atual, insere novo preço
    if ($count == 0) {
        // Obtém o preço atual da moeda (simule a lógica como achar necessário)
        $price = rand(1000, 50000); // Apenas um valor de exemplo
        $stmt = $pdo->prepare("INSERT INTO crypto_prices (coin_id, price, date) VALUES (:coin_id, :price, :today)");
        $stmt->execute(['coin_id' => $coinId, 'price' => $price, 'today' => $today]);

        // Se já existem mais de 3 registros, apaga o mais antigo
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM crypto_prices WHERE coin_id = :coin_id");
        $stmt->execute(['coin_id' => $coinId]);
        $totalCount = $stmt->fetchColumn();

        if ($totalCount > 3) {
            $stmt = $pdo->prepare("DELETE FROM crypto_prices WHERE coin_id = :coin_id ORDER BY date ASC LIMIT 1");
            $stmt->execute(['coin_id' => $coinId]);
        }
    }

    // Busca os últimos 3 registros dessa moeda
    $stmt = $pdo->prepare("SELECT price, date FROM crypto_prices WHERE coin_id = :coin_id ORDER BY date ASC LIMIT 3");
    $stmt->execute(['coin_id' => $coinId]);
    
    $prices = [];
    $dates = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $prices[] = $row['price'];
        $dates[] = $row['date'];
    }

    // Retorna os dados no formato esperado pelo Chart.js
    echo json_encode([
        'labels' => $dates,
        'prices' => $prices
    ]);

} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
