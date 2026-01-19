<?php
/**
 * CIVIQ Expense Ledger API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$pdo = new PDO(
    'mysql:host=localhost;dbname=lom1ubvhoxxi_sud_claude;charset=utf8mb4',
    'lom1ubvhoxxi_claude',
    'SLyb24sfbl5wJ',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';

switch ($action) {
    case 'list':
        $stmt = $pdo->query("SELECT * FROM civiq_expenses ORDER BY date DESC, id DESC");
        $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate totals
        $total = 0;
        $monthlyTotal = 0;
        $yearlyTotal = 0;

        foreach ($expenses as $exp) {
            $total += $exp['amount'];
            if ($exp['recurring'] === 'monthly') $monthlyTotal += $exp['amount'];
            if ($exp['recurring'] === 'yearly') $yearlyTotal += $exp['amount'];
        }

        echo json_encode([
            'success' => true,
            'expenses' => $expenses,
            'summary' => [
                'total' => round($total, 2),
                'monthly_recurring' => round($monthlyTotal, 2),
                'yearly_recurring' => round($yearlyTotal, 2),
                'count' => count($expenses)
            ]
        ]);
        break;

    case 'add':
        $data = json_decode(file_get_contents('php://input'), true);

        $stmt = $pdo->prepare("
            INSERT INTO civiq_expenses (date, category, description, vendor, amount, recurring, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['date'] ?? date('Y-m-d'),
            $data['category'] ?? 'Other',
            $data['description'] ?? '',
            $data['vendor'] ?? '',
            $data['amount'] ?? 0,
            $data['recurring'] ?? 'one-time',
            $data['notes'] ?? null
        ]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    case 'delete':
        $id = $_GET['id'] ?? $_POST['id'] ?? 0;
        $stmt = $pdo->prepare("DELETE FROM civiq_expenses WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Unknown action']);
}
