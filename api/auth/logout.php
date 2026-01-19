<?php
/**
 * CIVIQ User Logout
 * POST /api/auth/logout
 *
 * Headers: X-Session-Token
 * Returns: { success }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$token = $_SERVER['HTTP_X_SESSION_TOKEN'] ?? null;

if (!$token) {
    jsonError('No session token provided', 400);
}

$db = getDB();

// Delete the session
$stmt = $db->prepare("DELETE FROM sessions WHERE session_token = ?");
$stmt->execute([$token]);

jsonResponse([
    'success' => true,
    'message' => 'Logged out successfully'
]);
