export default function Avatar({ initials, color, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${color}20`,
        border: `2px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.33,
        fontWeight: 700,
        color,
        flexShrink: 0,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {initials}
    </div>
  )
}
