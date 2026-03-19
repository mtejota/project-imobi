import Icon from './Icon'
import { icons } from '../constants/icons'

export default function StatCard({ icon, label, value, delta, color, bg }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 22px',
        border: '1px solid #f1f5f9',
        flex: 1,
        minWidth: 0,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <Icon d={icons[icon]} size={18} />
        </div>
        {delta !== undefined && delta !== null && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: delta > 0 ? '#10b981' : '#ef4444',
              background: delta > 0 ? '#f0fdf4' : '#fef2f2',
              padding: '3px 8px',
              borderRadius: 20,
            }}
          >
            {delta > 0 ? '+' : ''}
            {delta}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', fontFamily: 'inherit', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}
