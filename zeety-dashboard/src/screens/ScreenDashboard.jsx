import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import ScoreBadge from '../components/ScoreBadge'
import StatCard from '../components/StatCard'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'
import { appointments, leads, notifications } from '../data'

export default function ScreenDashboard({ onOpenLeads, onOpenCalendar }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Bom dia, Lucas 👋</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Sábado, 7 de março de 2026 · {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>3 leads quentes</span>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon d={icons.whatsapp} size={14} stroke="#10b981" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>IA Ativa</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <StatCard icon="chat" label="Leads Hoje" value="14" delta={23} color="#3b82f6" bg="#eff6ff" />
        <StatCard icon="calendar" label="Visitas Hoje" value="4" delta={0} color="#8b5cf6" bg="#f5f3ff" />
        <StatCard icon="funnel" label="Negociações Ativas" value="9" delta={12} color="#f59e0b" bg="#fffbeb" />
        <StatCard icon="chart" label="Fechados este mês" value="R$ 3.2M" delta={8} color="#10b981" bg="#f0fdf4" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Leads Recentes</span>
              <span onClick={onOpenLeads} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>Ver todos →</span>
            </div>
            <div>
              {leads.slice(0, 4).map((l, i) => (
                <div
                  key={l.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 22px',
                    borderBottom: i < 3 ? '1px solid #f8fafc' : 'none',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Avatar initials={l.avatar} color={l.color} size={38} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{l.type} · {l.region} · {l.budget}</div>
                  </div>
                  <ScoreBadge score={l.score} />
                  <div style={{ fontSize: 11, color: '#cbd5e1', minWidth: 48, textAlign: 'right' }}>{l.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Agenda de Hoje</span>
              <span onClick={onOpenCalendar} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>Abrir calendário →</span>
            </div>
            <div style={{ padding: '8px 22px 18px' }}>
              {appointments.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < appointments.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ width: 48, textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: '#64748b' }}>{a.time}</div>
                  <div style={{ width: 3, height: 36, borderRadius: 4, background: a.status === 'confirmed' ? '#10b981' : '#f59e0b', flexShrink: 0 }} />
                  <Avatar initials={a.avatar} color={a.color} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.property}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: a.type === 'Visita' ? '#eff6ff' : '#f5f3ff', color: a.type === 'Visita' ? '#3b82f6' : '#8b5cf6' }}>{a.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#0f172a', borderRadius: 16, padding: '18px 20px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.zap} size={14} stroke="#22c55e" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>Alertas da IA</span>
              <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>4</div>
            </div>
            {notifications.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < notifications.length - 1 ? '1px solid #1e293b' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${n.bg}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={icons[n.icon]} size={14} stroke={n.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>{n.title}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{n.desc}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 16 }}>Funil do Mês</div>
            {[
              { label: 'Leads captados', val: 47, pct: 100, color: '#3b82f6' },
              { label: 'Qualificados', val: 29, pct: 62, color: '#8b5cf6' },
              { label: 'Visitas realizadas', val: 18, pct: 38, color: '#f59e0b' },
              { label: 'Propostas', val: 8, pct: 17, color: '#f97316' },
              { label: 'Fechamentos', val: 3, pct: 6, color: '#10b981' },
            ].map((row) => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{row.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{row.val}</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 4, transition: 'width 1s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
