export default function ScoreBadge({ score }) {
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : '#94a3b8'
  const bg = score >= 80 ? '#fef2f2' : score >= 60 ? '#fffbeb' : '#f8fafc'
  const label = score >= 80 ? 'Quente' : score >= 60 ? 'Morno' : 'Frio'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: `conic-gradient(${color} ${score * 3.6}deg, #e2e8f0 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 800,
            color,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {score}
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: '2px 8px', borderRadius: 20 }}>{label}</span>
    </div>
  )
}
