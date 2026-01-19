<?php
/**
 * CIVIQ Session Check
 * GET /api/auth/session
 *
 * Headers: X-Session-Token
 * Returns: { success, user } or { success: false }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$user = getCurrentUser();

if (!$user) {
    jsonResponse([
        'success' => false,
        'authenticated' => false,
        'message' => 'No valid session'
    ]);
}

// Update streak on each session check (once per day)
$streak = updateStreak($user['id']);

// Get preferences
$db = getDB();
$stmt = $db->prepare("SELECT interests, news_frequency, bias_preference FROM user_preferences WHERE user_id = ?");
$stmt->execute([$user['id']]);
$preferences = $stmt->fetch() ?: [];

jsonResponse([
    'success' => true,
    'authenticated' => true,
    'user' => [
        'id' => $user['id'],
        'email' => $user['email'],
        'display_name' => $user['display_name'],
        'username' => $user['username'],
        'zip_code' => $user['zip_code'],
        'state_code' => $user['state_code'],
        'city' => $user['city'],
        'county_id' => $user['county_id'],
        'congressional_district' => $user['congressional_district'],
        'state_senate_district' => $user['state_senate_district'],
        'state_house_district' => $user['state_house_district'],
        'school_district' => $user['school_district'],
        'party' => $user['party'],
        'xp_total' => $user['xp_total'],
        'level' => $user['level'],
        'streak_days' => $streak,
        'longest_streak' => $user['longest_streak'],
        'is_verified' => $user['is_verified'],
        'is_admin' => $user['is_admin'],
        'created_at' => $user['created_at']
    ],
    'preferences' => $preferences
]);
