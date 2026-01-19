import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header, Screen } from '../../components/layout';
import { Card } from '../../components/ui';
import { BiasBar, BiasLabel } from '../../components/ui';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function SourceProfileScreen() {
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSource() {
      try {
        const res = await fetch(`${API_BASE}/news/source.php?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setSource(data.source);
          setArticles(data.articles || []);
        } else {
          setError(data.error || 'Failed to load source');
        }
      } catch (e) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    }
    fetchSource();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header title="Loading..." backTo="/media" showSearch={false} />
        <Screen>
          <Card>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading source...</p>
          </Card>
        </Screen>
      </>
    );
  }

  if (error || !source) {
    return (
      <>
        <Header title="Error" backTo="/media" showSearch={false} />
        <Screen>
          <Card>
            <p style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{error || 'Source not found'}</p>
          </Card>
        </Screen>
      </>
    );
  }

  const typeLabels = {
    newspaper_daily: 'Daily Newspaper',
    newspaper_weekly: 'Weekly Newspaper',
    tv_station: 'TV Station',
    radio_station: 'Radio Station',
    online_only: 'Online Only',
    nonprofit_news: 'Nonprofit News',
    public_media: 'Public Media'
  };

  const reliability = source.bias?.factuality ? Math.round(source.bias.factuality * 100) : null;

  return (
    <>
      <Header title={source.name} subtitle={typeLabels[source.type] || source.type} backTo="/media" showSearch={false} />
      <Screen>
        <Card>
          {source.notes && (
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '16px' }}>
              {source.notes}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {source.founded && (
              <span style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                fontSize: '11px',
                color: 'var(--text-secondary)'
              }}>
                Est. {source.founded}
              </span>
            )}
            {source.ownership?.isLocal && (
              <span style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.15)',
                fontSize: '11px',
                color: '#F59E0B',
                fontWeight: 600
              }}>
                Locally Owned
              </span>
            )}
            <span style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}>
              {source.articleCount} articles
            </span>
          </div>
        </Card>

        <div className="section-header">
          <span className="section-title">Bias & Reliability</span>
        </div>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Political Bias</span>
              {source.bias?.score !== null ? (
                <BiasLabel value={source.bias.score} />
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Not rated</span>
              )}
            </div>
            <BiasBar value={source.bias?.score || 0} />
            {source.bias?.source && (
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Source: {source.bias.source}
              </div>
            )}
          </div>
          {reliability !== null && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Factuality Score</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{reliability}%</span>
              </div>
              <div style={{
                height: '8px',
                borderRadius: '4px',
                background: 'var(--bg-tertiary)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${reliability}%`,
                  height: '100%',
                  borderRadius: '4px',
                  background: reliability >= 80 ? 'linear-gradient(90deg, var(--accent-green), var(--accent-teal))' :
                             reliability >= 60 ? 'linear-gradient(90deg, #F59E0B, #EAB308)' :
                             'linear-gradient(90deg, #EF4444, #F97316)'
                }}></div>
              </div>
            </div>
          )}
        </Card>

        <div className="section-header">
          <span className="section-title">Details</span>
        </div>
        <Card>
          {source.ownership?.owner && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Owner</span>
              <span style={{ fontWeight: 500, fontSize: '13px' }}>{source.ownership.owner}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Type</span>
            <span style={{ fontWeight: 500, fontSize: '13px' }}>{typeLabels[source.type] || source.type}</span>
          </div>
          {source.paywall && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Paywall</span>
              <span style={{ fontWeight: 500, fontSize: '13px', textTransform: 'capitalize' }}>
                {source.paywall.replace('_', ' ')}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Website</span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 500, fontSize: '13px', color: 'var(--accent-purple)', textDecoration: 'none' }}
            >
              {source.url?.replace('https://', '').replace('http://', '').replace('www.', '')}
            </a>
          </div>
        </Card>

        <div className="section-header">
          <span className="section-title">Recent Articles</span>
          <span className="section-action">{articles.length} shown</span>
        </div>
        {articles.length > 0 ? (
          articles.map(article => (
            <Card key={article.id} style={{ marginBottom: '8px' }}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                  lineHeight: 1.4
                }}>
                  {article.title}
                </h4>
              </a>
              {article.lede && (
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  marginBottom: '4px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {article.lede}
                </p>
              )}
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                {article.author && ` • ${article.author}`}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>
              No recent articles from this source
            </p>
          </Card>
        )}
      </Screen>
    </>
  );
}
