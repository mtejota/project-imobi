export default function ScoreBadge({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score || 0)))
  const color = safeScore >= 80 ? '#ef4444' : safeScore >= 60 ? '#f59e0b' : '#94a3b8'
  const bg = safeScore >= 80 ? '#fef2f2' : safeScore >= 60 ? '#fffbeb' : '#f8fafc'
  const label = safeScore >= 80 ? 'Quente' : safeScore >= 60 ? 'Morno' : 'Frio'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, width: '100%', maxWidth: 156 }}>
      <div style={{ flex: 1, minWidth: 52 }}>
        <div style={{ height: 7, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${safeScore}%`,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${color}, ${color}cc)`,
              transition: 'width 0.35s ease',
            }}
          />
        </div>
        <div style={{ marginTop: 4, fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      </div>

      <span style={{ fontSize: 12, fontWeight: 800, color, background: bg, padding: '3px 8px', borderRadius: 999, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', flexShrink: 0 }}>
        {safeScore}%
      </span>
    </div>
  )
}
