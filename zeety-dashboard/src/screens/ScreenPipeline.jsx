import Avatar from '../components/Avatar'
import { pipeline } from '../data'

export default function ScreenPipeline() {
  const stages = Object.keys(pipeline)
  const stageColors = { Prospecção: '#64748b', Visita: '#3b82f6', Proposta: '#f59e0b', Negociação: '#f97316', Fechamento: '#10b981' }
  const total = stages.reduce((sum, s) => sum + pipeline[s].length, 0)

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Pipeline de Negociações</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{total} negociações ativas · R$ 5.03M em carteira</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Ordenar por valor</button>
          <button style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Negociação</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {stages.map((stage) => (
          <div key={stage} style={{ minWidth: 220, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stageColors[stage] }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{stage}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: stageColors[stage], background: `${stageColors[stage]}18`, padding: '2px 8px', borderRadius: 20 }}>{pipeline[stage].length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pipeline[stage].map((card) => (
                <div
                  key={card.id}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: '14px 16px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    borderLeft: `3px solid ${stageColors[stage]}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Avatar initials={card.avatar} color={card.color} size={30} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{card.name}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>{card.property}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{card.value}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{card.days}d</span>
                  </div>
                </div>
              ))}
              <button style={{ width: '100%', padding: '10px', borderRadius: 14, border: '2px dashed #e2e8f0', background: 'transparent', color: '#cbd5e1', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>+ Adicionar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
