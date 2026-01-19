<?php
$host = 'localhost';
$dbname = 'lom1ubvhoxxi_sud_claude';
$username = 'lom1ubvhoxxi_claude';
$password = 'SLyb24sfbl5wJ';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $result = $pdo->query("DESCRIBE claude_learnings");
    echo "claude_learnings table structure:\n";
    echo str_repeat("-", 60) . "\n";
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['Field']} - {$row['Type']} - {$row['Null']} - {$row['Key']}\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
