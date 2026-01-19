<?php
/**
 * CIVIQ User Login
 * POST /api/auth/login
 *
 * Body: { email, password }
 * Returns: { success, user, session_token }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    jsonError('Email and password are required');
}

$db = getDB();

// Find user by email
$stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    jsonError('Invalid email or password', 401);
}

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    jsonError('Invalid email or password', 401);
}

// Create new session
$sessionToken = generateToken();
$expiresAt = date('Y-m-d H:i:s', time() + SESSION_DURATION);

$stmt = $db->prepare("
    INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->execute([
    $user['id'],
    $sessionToken,
    $expiresAt,
    $_SERVER['REMOTE_ADDR'] ?? null,
    $_SERVER['HTTP_USER_AGENT'] ?? null
]);

// Update last login
$stmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
$stmt->execute([$user['id']]);

// Update streak
$streak = updateStreak($user['id']);

// Return user data (excluding sensitive fields)
jsonResponse([
    'success' => true,
    'user' => [
        'id' => $user['id'],
        'email' => $user['email'],
        'zip_code' => $user['zip_code'],
        'state_code' => $user['state_code'],
        'city' => $user['city'],
        'xp_total' => $user['xp_total'],
        'level' => $user['level'],
        'streak_days' => $streak,
        'created_at' => $user['created_at']
    ],
    'session_token' => $sessionToken,
    'message' => 'Login successful'
]);
