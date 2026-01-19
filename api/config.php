<?php
/**
 * CIVIQ API Configuration
 * Database connection and helper functions
 */

// CORS headers for React app
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-Token');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'lom1ubvhoxxi_civiq');
define('DB_USER', 'lom1ubvhoxxi_claude');
define('DB_PASS', 'SLyb24sfbl5wJ');

// Load credentials from central database
require_once __DIR__ . '/../../datacore/Credentials.php';
$google = Credentials::get('google_maps');
$mapbox = Credentials::get('mapbox');

// Google API key (for Civic Information API)
define('GOOGLE_API_KEY', $google['api_key']);

// Mapbox API token (for in-app mapping)
define('MAPBOX_TOKEN', $mapbox['api_token']);

// Google Service Account (civiq-datacore-services@civiq-484204.iam.gserviceaccount.com)
// Credentials file should be stored securely and referenced here
define('GOOGLE_SERVICE_ACCOUNT', 'civiq-datacore-services@civiq-484204.iam.gserviceaccount.com');

// Session settings
define('SESSION_DURATION', 60 * 60 * 24 * 30); // 30 days

// XP settings
define('XP_READ_ARTICLE', 10);
define('XP_DAILY_LOGIN', 5);
define('XP_STREAK_BONUS', 50);
define('XP_QUIZ_COMPLETE', 50);
define('XP_COURSE_LESSON', 25);

/**
 * Get PDO database connection
 */
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            jsonError('Database connection failed', 500);
        }
    }
    return $pdo;
}

/**
 * Send JSON response
 */
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

/**
 * Send JSON error
 */
function jsonError($message, $code = 400) {
    jsonResponse(['error' => $message, 'success' => false], $code);
}

/**
 * Get JSON input
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    return $data ?: [];
}

/**
 * Generate secure random token
 */
function generateToken($length = 64) {
    return bin2hex(random_bytes($length / 2));
}

/**
 * Validate email format
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate ZIP code (US format)
 */
function validateZip($zip) {
    return preg_match('/^\d{5}(-\d{4})?$/', $zip);
}

/**
 * Get current user from session token
 */
function getCurrentUser() {
    $token = $_SERVER['HTTP_X_SESSION_TOKEN'] ?? null;

    if (!$token) {
        return null;
    }

    $db = getDB();
    $stmt = $db->prepare("
        SELECT u.* FROM users u
        JOIN sessions s ON s.user_id = u.id
        WHERE s.session_token = ? AND s.expires_at > NOW()
    ");
    $stmt->execute([$token]);
    return $stmt->fetch();
}

/**
 * Require authenticated user
 */
function requireAuth() {
    $user = getCurrentUser();
    if (!$user) {
        jsonError('Authentication required', 401);
    }
    return $user;
}

/**
 * Update user XP and check for level up
 */
function addXP($userId, $amount, $actionType, $description = null) {
    $db = getDB();

    // Log XP transaction
    $stmt = $db->prepare("
        INSERT INTO xp_log (user_id, xp_amount, action_type, description)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$userId, $amount, $actionType, $description]);

    // Update user total XP
    $stmt = $db->prepare("
        UPDATE users
        SET xp_total = xp_total + ?
        WHERE id = ?
    ");
    $stmt->execute([$amount, $userId]);

    // Check for level up (every 500 XP)
    $stmt = $db->prepare("SELECT xp_total FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    $newLevel = floor($user['xp_total'] / 500) + 1;
    $stmt = $db->prepare("UPDATE users SET level = ? WHERE id = ? AND level < ?");
    $stmt->execute([$newLevel, $userId, $newLevel]);

    return $amount;
}

/**
 * Update user streak
 */
function updateStreak($userId) {
    $db = getDB();

    $stmt = $db->prepare("SELECT last_active_date, streak_days, longest_streak FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    $today = date('Y-m-d');
    $lastActive = $user['last_active_date'];
    $streak = $user['streak_days'] ?? 0;
    $longest = $user['longest_streak'] ?? 0;

    if ($lastActive === $today) {
        // Already active today
        return $streak;
    }

    $yesterday = date('Y-m-d', strtotime('-1 day'));

    if ($lastActive === $yesterday) {
        // Continuing streak
        $streak++;
        if ($streak > $longest) {
            $longest = $streak;
        }
        // Bonus XP for streak milestones (every 7 days)
        if ($streak % 7 === 0) {
            addXP($userId, XP_STREAK_BONUS, 'streak_bonus', "7-day streak bonus");
        }
    } else {
        // Streak broken, start fresh
        $streak = 1;
    }

    // Daily login XP
    addXP($userId, XP_DAILY_LOGIN, 'daily_login', 'Daily login');

    $stmt = $db->prepare("
        UPDATE users
        SET streak_days = ?, longest_streak = ?, last_active_date = ?
        WHERE id = ?
    ");
    $stmt->execute([$streak, $longest, $today, $userId]);

    return $streak;
}
