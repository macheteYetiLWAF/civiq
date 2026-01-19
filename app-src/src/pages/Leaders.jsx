import { useState, useEffect } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { civic } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Leaders() {
  const { user } = useAuth()
  const [officials, setOfficials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadRepresentatives()
  }, [user])

  async function loadRepresentatives() {
    try {
      setLoading(true)
      const data = await civic.getRepresentatives(user?.zip_code)
      setOfficials(data.officials || [])
    } catch (err) {
      console.error('Failed to load representatives:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Group officials by level
  const federal = officials.filter(o => o.level === 'federal')
  const state = officials.filter(o => o.level === 'state')
  const local = officials.filter(o => o.level === 'local')

  // Get party color
  function getPartyColor(party) {
    if (!party) return 'var(--bg-tertiary)'
    const p = party.toLowerCase()
    if (p.includes('democrat')) return 'var(--bias-left)'
    if (p.includes('republican')) return 'var(--bias-right)'
    return 'var(--accent)'
  }

  // Get party abbreviation
  function getPartyAbbrev(party) {
    if (!party) return ''
    const p = party.toLowerCase()
    if (p.includes('democrat')) return 'D'
    if (p.includes('republican')) return 'R'
    if (p.includes('independent')) return 'I'
    if (p.includes('libertarian')) return 'L'
    if (p.includes('green')) return 'G'
    return party.charAt(0).toUpperCase()
  }

  // Get initials from name
  function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase()
  }

  function OfficialCard({ official }) {
    const partyColor = getPartyColor(official.party)
    const partyAbbrev = getPartyAbbrev(official.party)

    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {official.photoUrl ? (
          <img
            src={official.photoUrl}
            alt={official.name}
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div style={{
            width: '48px',
            height: '48px',
            background: partyColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600
          }}>
            {getInitials(official.name)}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{official.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{official.title}</div>
        </div>
        {partyAbbrev && (
          <span style={{
            background: partyColor,
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600
          }}>
            {partyAbbrev}
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      <Header />

      <div className="content" style={{ flex: 1 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '14px' }}>Loading your representatives...</div>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--danger)' }}>
            <div style={{ fontSize: '14px' }}>{error}</div>
            <button
              onClick={loadRepresentatives}
              className="btn btn-outline"
              style={{ marginTop: '16px' }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && officials.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '14px' }}>No representatives found for your location.</div>
          </div>
        )}

        {!loading && !error && officials.length > 0 && (
          <>
            {/* Federal */}
            {federal.length > 0 && (
              <>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--gov-federal)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  marginTop: '16px'
                }}>
                  Federal
                </div>
                {federal.map((official, i) => (
                  <OfficialCard key={`federal-${i}`} official={official} />
                ))}
              </>
            )}

            {/* State */}
            {state.length > 0 && (
              <>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--gov-state)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  marginTop: '24px'
                }}>
                  State
                </div>
                {state.map((official, i) => (
                  <OfficialCard key={`state-${i}`} official={official} />
                ))}
              </>
            )}

            {/* Local */}
            {local.length > 0 && (
              <>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--gov-local)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  marginTop: '24px'
                }}>
                  Local
                </div>
                {local.map((official, i) => (
                  <OfficialCard key={`local-${i}`} official={official} />
                ))}
              </>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </>
  )
}
