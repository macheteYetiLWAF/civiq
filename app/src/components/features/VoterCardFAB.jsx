export default function VoterCardFAB({ onClick }) {
  return (
    <button
      className="voter-card-fab"
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        border: 'none',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        zIndex: 100
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
      }}
    >
      <i
        className="fas fa-id-card"
        style={{ fontSize: '24px', color: '#FFFFFF' }}
      />
    </button>
  );
}
