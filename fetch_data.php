<?php
// Conectar ao banco de dados
$pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
$query = $pdo->query("SELECT * FROM crypto_data ORDER BY date_collected ASC");

$chartData = [];
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
    $chartData[] = [
        'date' => $row['date_collected'],
        'price' => $row['price']
    ];
}

echo json_encode($chartData);
?>
