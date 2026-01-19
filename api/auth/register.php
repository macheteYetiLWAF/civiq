<?php
/**
 * CIVIQ User Registration
 * POST /api/auth/register
 *
 * Body: { email, password, zip_code }
 * Returns: { success, user, session_token }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();

// Validate required fields
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$zipCode = trim($input['zip_code'] ?? '');
$displayName = trim($input['display_name'] ?? '');
$divisions = $input['divisions'] ?? [];
$normalizedAddress = $input['normalized_address'] ?? null;
$coordinates = $input['coordinates'] ?? null; // [lng, lat]

if (!$email || !$password || !$zipCode) {
    jsonError('Email, password, and ZIP code are required');
}

if (!validateEmail($email)) {
    jsonError('Invalid email format');
}

if (strlen($password) < 8) {
    jsonError('Password must be at least 8 characters');
}

if (!validateZip($zipCode)) {
    jsonError('Invalid ZIP code format');
}

$db = getDB();

// Check if email already exists
$stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonError('Email already registered');
}

// Get state from ZIP code using Google Geocoding API
$stateCode = null;
$city = null;
$lat = null;
$lng = null;

$geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($zipCode) . "&key=" . GOOGLE_API_KEY;
$geoResponse = @file_get_contents($geoUrl);

if ($geoResponse) {
    $geoData = json_decode($geoResponse, true);
    if (!empty($geoData['results'][0])) {
        $result = $geoData['results'][0];

        // Extract location
        if (isset($result['geometry']['location'])) {
            $lat = $result['geometry']['location']['lat'];
            $lng = $result['geometry']['location']['lng'];
        }

        // Extract state and city from address components
        foreach ($result['address_components'] as $component) {
            if (in_array('administrative_area_level_1', $component['types'])) {
                $stateCode = $component['short_name'];
            }
            if (in_array('locality', $component['types'])) {
                $city = $component['long_name'];
            }
        }
    }
}

// Hash password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Generate voter hash (for future blockchain integration)
$voterHash = hash('sha256', $email . time() . random_bytes(16));

// Override city/state from normalized address if provided
if ($normalizedAddress) {
    if (!empty($normalizedAddress['city'])) {
        $city = $normalizedAddress['city'];
    }
    if (!empty($normalizedAddress['state'])) {
        $stateCode = $normalizedAddress['state'];
    }
}

// Override lat/lng from coordinates if provided (more accurate than geocode API)
if ($coordinates && is_array($coordinates) && count($coordinates) >= 2) {
    $lng = $coordinates[0];
    $lat = $coordinates[1];
}

// Create user
$stmt = $db->prepare("
    INSERT INTO users (voter_hash, email, password_hash, zip_code, state_code, city, latitude, longitude, display_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([$voterHash, $email, $passwordHash, $zipCode, $stateCode, $city, $lat, $lng, $displayName ?: null]);
$userId = $db->lastInsertId();

// Store user divisions if provided
if (!empty($divisions) && is_array($divisions)) {
    // First, try to fetch full division data from cache or API
    $divisionData = [];

    // Check civic_cache for division details
    $stmt = $db->prepare("
        SELECT response_data FROM civic_cache
        WHERE (zip_code = ? OR address = ?)
        AND data_type = 'divisions'
        AND expires_at > NOW()
        ORDER BY fetched_at DESC
        LIMIT 1
    ");
    $stmt->execute([$zipCode, $zipCode]);
    $cached = $stmt->fetch();

    if ($cached) {
        $cachedData = json_decode($cached['response_data'], true);
        if (!empty($cachedData['divisions'])) {
            foreach ($cachedData['divisions'] as $div) {
                $divisionData[$div['ocdId']] = $div;
            }
        }
    }

    // Insert divisions
    $insertStmt = $db->prepare("
        INSERT IGNORE INTO user_divisions (user_id, ocd_id, name, level)
        VALUES (?, ?, ?, ?)
    ");

    foreach ($divisions as $ocdId) {
        $name = $divisionData[$ocdId]['name'] ?? $ocdId;
        $level = $divisionData[$ocdId]['level'] ?? 'local';
        $insertStmt->execute([$userId, $ocdId, $name, $level]);

        // Also extract district numbers for user table
        if (preg_match('/\/cd:(\d+)$/', $ocdId, $m)) {
            $db->prepare("UPDATE users SET congressional_district = ? WHERE id = ?")->execute([$m[1], $userId]);
        }
        if (preg_match('/\/sldu:(\d+)$/', $ocdId, $m)) {
            $db->prepare("UPDATE users SET state_senate_district = ? WHERE id = ?")->execute([$m[1], $userId]);
        }
        if (preg_match('/\/sldl:(\d+)$/', $ocdId, $m)) {
            $db->prepare("UPDATE users SET state_house_district = ? WHERE id = ?")->execute([$m[1], $userId]);
        }
    }
}

// Create session
$sessionToken = generateToken();
$expiresAt = date('Y-m-d H:i:s', time() + SESSION_DURATION);

$stmt = $db->prepare("
    INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->execute([
    $userId,
    $sessionToken,
    $expiresAt,
    $_SERVER['REMOTE_ADDR'] ?? null,
    $_SERVER['HTTP_USER_AGENT'] ?? null
]);

// Create default preferences
$stmt = $db->prepare("
    INSERT INTO user_preferences (user_id, interests)
    VALUES (?, '[]')
");
$stmt->execute([$userId]);

// Award signup XP
addXP($userId, 100, 'signup', 'Welcome bonus');

// Return user data
$stmt = $db->prepare("
    SELECT id, email, display_name, zip_code, state_code, city, congressional_district,
           state_senate_district, state_house_district, xp_total, level, streak_days, created_at
    FROM users WHERE id = ?
");
$stmt->execute([$userId]);
$user = $stmt->fetch();

// Include divisions in response
$stmt = $db->prepare("SELECT ocd_id, name, level FROM user_divisions WHERE user_id = ?");
$stmt->execute([$userId]);
$user['divisions'] = $stmt->fetchAll();

jsonResponse([
    'success' => true,
    'user' => $user,
    'session_token' => $sessionToken,
    'message' => 'Registration successful'
]);
