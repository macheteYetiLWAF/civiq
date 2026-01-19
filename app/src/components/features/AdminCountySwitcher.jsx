import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

/**
 * Admin County Switcher - Floating button that opens a county picker
 * Only visible when admin mode is enabled
 */
export default function AdminCountySwitcher() {
  const { isAdmin, countyOverride, setCountyOverride, availableCounties } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if not admin
  if (!isAdmin) return null;

  const currentCounty = countyOverride?.name || 'Default';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '16px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        title={`Admin: ${currentCounty}`}
      >
        <i className="fas fa-map-marker-alt" style={{ color: 'white', fontSize: '18px' }}></i>
      </button>

      {/* County Badge showing current selection */}
      {countyOverride && (
        <div
          style={{
            position: 'fixed',
            bottom: '132px',
            left: '16px',
            background: 'rgba(245, 158, 11, 0.9)',
            color: 'white',
            fontSize: '9px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '4px',
            zIndex: 1000,
            maxWidth: '60px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {countyOverride.name}
        </div>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            style={{
              background: 'var(--bg-primary, #0F0F1A)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '320px',
              maxHeight: '70vh',
              overflow: 'hidden',
              border: '1px solid var(--border, #2D2D3D)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid var(--border, #2D2D3D)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Admin: View As County
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Switch to view data as different county
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* County List */}
            <div style={{ maxHeight: '50vh', overflowY: 'auto', padding: '8px' }}>
              {/* Reset to Default */}
              <button
                onClick={() => {
                  setCountyOverride(null);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: !countyOverride ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  border: !countyOverride ? '1px solid #8B5CF6' : '1px solid transparent',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <i className="fas fa-home" style={{ color: '#8B5CF6', width: '20px' }}></i>
                Default (Luzerne)
                {!countyOverride && (
                  <i className="fas fa-check" style={{ marginLeft: 'auto', color: '#8B5CF6' }}></i>
                )}
              </button>

              {/* Available Counties */}
              {availableCounties.map(county => (
                <button
                  key={county.id}
                  onClick={() => {
                    setCountyOverride(county);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: countyOverride?.id === county.id ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    border: countyOverride?.id === county.id ? '1px solid #F59E0B' : '1px solid transparent',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <i className="fas fa-map-marker-alt" style={{ color: '#F59E0B', width: '20px' }}></i>
                  {county.name}
                  {county.officialsCount > 0 && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      ({county.officialsCount} officials)
                    </span>
                  )}
                  {countyOverride?.id === county.id && (
                    <i className="fas fa-check" style={{ marginLeft: 'auto', color: '#F59E0B' }}></i>
                  )}
                </button>
              ))}

              {availableCounties.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                  Loading counties...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
