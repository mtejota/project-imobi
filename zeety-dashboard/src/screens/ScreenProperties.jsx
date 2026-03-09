import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenProperties({ properties = [], onOpenPropertyDetail, onOpenNewProperty }) {
  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Imóveis</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            {properties.length} imóveis em carteira · {properties.filter((p) => String(p.status || '').toLowerCase().includes('dispon')).length} disponíveis
          </div>
        </div>
        <button onClick={onOpenNewProperty} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Cadastrar Imóvel</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {properties.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #f1f5f9',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
            }}
            onClick={() => onOpenPropertyDetail?.(p)}
          >
            <div style={{ position: 'relative' }}>
              <img src={p.img} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: p.status === 'Disponível' ? '#dcfce7' : '#fef9c3', color: p.status === 'Disponível' ? '#16a34a' : '#ca8a04' }}>{p.status}</span>
              </div>
              <button style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.star} size={14} stroke="#f59e0b" />
              </button>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{p.title}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1a56db', fontFamily: "'DM Mono', monospace" }}>{p.price}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                {[
                  { icon: 'layers', val: p.area },
                  { icon: 'user', val: `${p.beds}Q` },
                  { icon: 'home', val: `${p.baths}B` },
                ].map(({ icon, val }) => (
                  <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
                    <Icon d={icons[icon]} size={13} stroke="#94a3b8" /> {val}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenPropertyDetail?.(p)
                  }}
                  style={{ flex: 1, padding: '8px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
                >
                  Ver detalhes
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', background: '#eff6ff', fontSize: 11, fontWeight: 700, color: '#1a56db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                  <Icon d={icons.send} size={12} /> Compartilhar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
