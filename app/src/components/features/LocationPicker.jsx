import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Public token for client-side use (geocoding/display only)
// Note: For production, this should come from env or API
const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoibWFjaGV0ZXlldGkiLCJhIjoiY2toMnB0MXRvMDVhMTJybXRtZmtncWVoeiJ9.aAtbqMnDOFr-eCe6LN4IqQ';

/**
 * LocationPicker - Mapbox-based location picker for registration
 *
 * Props:
 * - onLocationSelect: (location) => void - Called when user selects a location
 * - initialCenter: [lng, lat] - Initial map center
 * - initialZoom: number - Initial zoom level
 * - disabled: boolean - Disable interaction
 */
export default function LocationPicker({
  onLocationSelect,
  initialCenter = [-75.8, 41.2], // Default: NEPA region
  initialZoom = 9,
  disabled = false,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (map.current) return; // Already initialized

    mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme to match app
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    // Add minimal attribution
    map.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    // Click handler to place marker
    map.current.on('click', async (e) => {
      if (disabled) return;

      const { lng, lat } = e.lngLat;

      // Update or create marker
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker({ color: '#8B5CF6' })
          .setLngLat([lng, lat])
          .addTo(map.current);
      }

      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_PUBLIC_TOKEN}&types=postcode,place,address`
        );
        const data = await response.json();

        if (data.features?.length > 0) {
          const feature = data.features[0];
          const location = {
            center: [lng, lat],
            formatted_address: feature.place_name,
            components: extractComponents(feature),
          };

          setSelectedLocation(location);
          onLocationSelect?.(location);
        }
      } catch (err) {
        console.error('Reverse geocode failed:', err);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map when disabled state changes
  useEffect(() => {
    if (!map.current) return;

    if (disabled) {
      map.current.scrollZoom.disable();
      map.current.dragPan.disable();
    } else {
      map.current.scrollZoom.enable();
      map.current.dragPan.enable();
    }
  }, [disabled]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '200px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      />
      {selectedLocation && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: 'var(--bg-tertiary)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: '#8B5CF6' }} />
          {selectedLocation.formatted_address}
        </div>
      )}
    </div>
  );
}

/**
 * Extract address components from Mapbox feature
 */
function extractComponents(feature) {
  const components = {};

  // Main feature might be the postcode/place
  if (feature.id?.startsWith('postcode')) {
    components.zip = feature.text;
  } else if (feature.id?.startsWith('place')) {
    components.city = feature.text;
  }

  // Extract from context array
  for (const ctx of feature.context || []) {
    if (ctx.id?.startsWith('postcode')) {
      components.zip = ctx.text;
    } else if (ctx.id?.startsWith('place')) {
      components.city = ctx.text;
    } else if (ctx.id?.startsWith('region')) {
      components.state = ctx.short_code?.replace('US-', '') || ctx.text;
    }
  }

  return components;
}
