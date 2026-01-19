<?php
/**
 * CIVIQ Geocoding API
 * GET /api/geo/geocode?address=ZIP or full address
 *
 * Proxies Mapbox Geocoding API (secure backend call)
 * Returns: { success, results[], center }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$address = $_GET['address'] ?? null;

if (!$address) {
    jsonError('Address required');
}

// Use Mapbox token from config
// Note: Mapbox sk.* (secret) tokens don't work for Geocoding API - need pk.* (public) token
$mapboxToken = defined('MAPBOX_TOKEN') ? MAPBOX_TOKEN : null;

// Skip Mapbox if using secret token (sk.*) - it won't work for Geocoding
if (!$mapboxToken || strpos($mapboxToken, 'sk.') === 0) {
    // Fallback: use Google Geocoding if Mapbox not configured
    $geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($address) . "&key=" . GOOGLE_API_KEY;
    $response = @file_get_contents($geoUrl);

    if (!$response) {
        jsonError('Geocoding failed', 500);
    }

    $data = json_decode($response, true);

    // Check for API errors (not enabled, etc)
    if (!empty($data['error_message'])) {
        // For now, return a minimal success with just the zip so registration can proceed
        // ZIP validation passed, so we trust the address even without geocode
        if (preg_match('/^\d{5}$/', $address)) {
            jsonResponse([
                'success' => true,
                'source' => 'fallback',
                'center' => null,
                'formatted_address' => $address,
                'components' => ['zip' => $address],
                'note' => 'Geocoding API unavailable'
            ]);
        }
        jsonError('Geocoding service unavailable');
    }

    if (!empty($data['results'][0])) {
        $result = $data['results'][0];
        jsonResponse([
            'success' => true,
            'source' => 'google',
            'center' => [
                $result['geometry']['location']['lng'],
                $result['geometry']['location']['lat']
            ],
            'formatted_address' => $result['formatted_address'],
            'components' => extractAddressComponents($result['address_components'])
        ]);
    }

    // If no results but valid zip, return fallback
    if (preg_match('/^\d{5}$/', $address)) {
        jsonResponse([
            'success' => true,
            'source' => 'fallback',
            'center' => null,
            'formatted_address' => $address,
            'components' => ['zip' => $address]
        ]);
    }

    jsonError('Location not found');
}

// Mapbox Geocoding API
$mapboxUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" . urlencode($address) . ".json?" . http_build_query([
    'access_token' => $mapboxToken,
    'country' => 'US',
    'types' => 'postcode,place,address',
    'limit' => 1
]);

$context = stream_context_create(['http' => ['ignore_errors' => true]]);
$response = @file_get_contents($mapboxUrl, false, $context);

if (!$response) {
    jsonError('Geocoding failed', 500);
}

$data = json_decode($response, true);

if (isset($data['message'])) {
    // Mapbox error
    jsonError($data['message'], 400);
}

if (empty($data['features'])) {
    jsonError('Location not found');
}

$feature = $data['features'][0];
$center = $feature['center'] ?? null; // [lng, lat]

// Extract address components from Mapbox context
$components = [];
foreach ($feature['context'] ?? [] as $ctx) {
    $id = $ctx['id'] ?? '';
    if (strpos($id, 'postcode') === 0) {
        $components['zip'] = $ctx['text'];
    } elseif (strpos($id, 'place') === 0) {
        $components['city'] = $ctx['text'];
    } elseif (strpos($id, 'region') === 0) {
        $components['state'] = $ctx['short_code'] ?? $ctx['text'];
        // Clean up state code (e.g., "US-PA" -> "PA")
        if (isset($components['state']) && strpos($components['state'], 'US-') === 0) {
            $components['state'] = substr($components['state'], 3);
        }
    } elseif (strpos($id, 'country') === 0) {
        $components['country'] = $ctx['short_code'] ?? $ctx['text'];
    }
}

// If the main feature is a postcode, extract its text
if (strpos($feature['id'] ?? '', 'postcode') === 0) {
    $components['zip'] = $feature['text'];
}

jsonResponse([
    'success' => true,
    'source' => 'mapbox',
    'center' => $center,
    'formatted_address' => $feature['place_name'] ?? $address,
    'components' => $components,
    'bbox' => $feature['bbox'] ?? null
]);

/**
 * Helper to extract Google address components
 */
function extractAddressComponents($components) {
    $result = [];
    foreach ($components as $comp) {
        if (in_array('postal_code', $comp['types'])) {
            $result['zip'] = $comp['short_name'];
        }
        if (in_array('locality', $comp['types'])) {
            $result['city'] = $comp['long_name'];
        }
        if (in_array('administrative_area_level_1', $comp['types'])) {
            $result['state'] = $comp['short_name'];
        }
        if (in_array('country', $comp['types'])) {
            $result['country'] = $comp['short_name'];
        }
    }
    return $result;
}
