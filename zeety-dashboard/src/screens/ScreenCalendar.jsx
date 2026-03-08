import { appointments } from '../data'

export default function ScreenCalendar() {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  const scheduled = {
    '09:00': { name: 'João Ferreira', type: 'Visita', color: '#3b82f6', duration: 1 },
    '11:00': { name: 'Ana Rodrigues', type: 'Visita', color: '#f59e0b', duration: 1 },
    '14:30': { name: 'Beatriz Santos', type: 'Reunião', color: '#8b5cf6', duration: 1 },
    '16:00': { name: 'Rafael Mendes', type: 'Visita', color: '#10b981', duration: 1 },
  }

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Agenda</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Março 2026 · 4 compromissos hoje</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Dia', 'Semana', 'Mês'].map((v) => (
            <button key={v} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', borderColor: v === 'Semana' ? '#1a56db' : '#e2e8f0', background: v === 'Semana' ? '#eff6ff' : '#fff', color: v === 'Semana' ? '#1a56db' : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{v}</button>
          ))}
          <button style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Agendar</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        <div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Março 2026</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12 }}>‹</button>
                <button style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12 }}>›</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
              {days.map((d) => <div key={d} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', padding: '4px 0' }}>{d}</div>)}
              {[...Array(6)].map((_, i) => <div key={i} />)}
              {[...Array(31)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '6px 4px',
                    fontSize: 11,
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: i + 1 === 7 ? '#1a56db' : 'transparent',
                    color: i + 1 === 7 ? '#fff' : [2, 5, 8, 12, 15, 18, 22, 25, 28].includes(i + 1) ? '#3b82f6' : '#374151',
                    fontWeight: i + 1 === 7 ? 800 : [2, 5, 8, 12, 15, 18, 22, 25, 28].includes(i + 1) ? 700 : 400,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f8fafc', fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Próximas visitas</div>
            {appointments.map((a, i) => (
              <div key={a.id} style={{ padding: '12px 18px', borderBottom: i < appointments.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 32, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{a.time} · {a.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{a.property}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #f1f5f9' }}>
            <div />
            {days.map((d, i) => (
              <div key={d} style={{ padding: '12px 8px', textAlign: 'center', borderLeft: '1px solid #f8fafc' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{d}</div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '4px auto 0', background: i === 6 ? '#1a56db' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: i === 6 ? 800 : 600, color: i === 6 ? '#fff' : '#0f172a' }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 420 }}>
            {hours.map((h) => (
              <div key={h} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ padding: '8px 10px', fontSize: 10, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>{h}</div>
                {[...Array(7)].map((_, di) => (
                  <div key={di} style={{ minHeight: 40, borderLeft: '1px solid #f8fafc', padding: 3 }}>
                    {di === 6 && scheduled[h] && (
                      <div style={{ background: `${scheduled[h].color}18`, borderLeft: `3px solid ${scheduled[h].color}`, borderRadius: 6, padding: '4px 8px', height: '100%' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: scheduled[h].color }}>{scheduled[h].name}</div>
                        <div style={{ fontSize: 9, color: '#94a3b8' }}>{scheduled[h].type}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
