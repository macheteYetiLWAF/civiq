import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

/**
 * Universal Header Component
 *
 * Layout: [Back?] [CIVIQ logo] | [Title/Subtitle] ... [Search?] [Avatar]
 * Background: linear-gradient(180deg, #1E1E2E 0%, #0F172A 100%)
 * Border: 1px solid rgba(139, 92, 246, 0.2)
 *
 * Props:
 * - title: string - Main header title
 * - subtitle: string (optional) - Subtitle text
 * - showSearch: boolean (default: true) - Show search icon
 * - showBack: boolean (default: false) - Show back button
 * - backTo: string (optional) - Route for back button, uses navigate(-1) if not provided
 * - onBack: function (optional) - Custom back handler
 * - showAvatar: boolean (default: true) - Show user avatar
 * - rightAction: ReactNode (optional) - Custom right action element
 */
export default function Header({
  title,
  subtitle,
  showSearch = true,
  showBack = false,
  backTo,
  onBack,
  showAvatar = true,
  rightAction,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  // Get user initials from display_name or email
  const getInitials = () => {
    if (user?.display_name) {
      const parts = user.display_name.trim().split(' ');
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      // Single-word names - just use first letter
      return parts[0].charAt(0).toUpperCase();
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      // Email username - just use first letter
      return emailName.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      style={{
        background: 'linear-gradient(180deg, #1E1E2E 0%, #0F172A 100%)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        touchAction: 'pan-x pan-y',
        transform: 'translateZ(0)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Left section: Back button (optional) + Logo + Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Back button */}
          {(showBack || backTo) && (
            <button
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Go back"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}

          {/* CIVIQ Logo */}
          <span
            className="logo-gradient"
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              flexShrink: 0,
            }}
          >
            CIVIQ
            {isAdmin && (
              <span style={{
                fontSize: '8px',
                color: '#F59E0B',
                marginLeft: '4px',
                verticalAlign: 'super',
              }}>★</span>
            )}
          </span>

          {/* Divider */}
          {title && (
            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'rgba(139, 92, 246, 0.3)',
                flexShrink: 0,
              }}
            />
          )}

          {/* Title and Subtitle */}
          {title && (
            <div
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: subtitle ? '16px' : '18px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right section: Search + Avatar + Custom action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          {/* Search button */}
          {showSearch && (
            <Link
              to="/search"
              style={{
                color: 'var(--text-primary)',
                fontSize: '16px',
                textDecoration: 'none',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Search"
            >
              <i className="fas fa-search"></i>
            </Link>
          )}

          {/* User Avatar */}
          {showAvatar && (
            <Link
              to="/profile"
              style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: 'white',
                textDecoration: 'none',
              }}
              aria-label="Profile"
            >
              {getInitials()}
            </Link>
          )}

          {/* Custom right action */}
          {rightAction}
        </div>
      </div>
    </header>
  );
}
