import { useEffect, useMemo, useState } from 'react'
import Avatar from '../components/Avatar'
import ScoreBadge from '../components/ScoreBadge'
import StatCard from '../components/StatCard'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenDashboard({ onOpenLeads, onOpenCalendar, userName = 'Usuário', alerts = [], onDismissAlert, onClearAlerts, leads = [], appointments = [] }) {
  const [time, setTime] = useState(new Date())
  const [showCharts, setShowCharts] = useState(false)
  const [ready, setReady] = useState(false)

  const hotLeads = useAnimatedNumber(leads.filter((lead) => Number(lead.score || 0) >= 80).length, 900)
  const alertsCount = alerts.length
  const leadsToday = useAnimatedNumber(leads.length, 1000)
  const visitsToday = useAnimatedNumber(appointments.length, 1000)
  const activeNegotiations = useAnimatedNumber(leads.filter((lead) => ['PROPOSAL', 'NEGOTIATION', 'CLOSING'].includes(String(lead.stage || '').toUpperCase())).length, 1000)
  const monthlyClosedMillions = useAnimatedNumber(0, 1100)
  const leadsCaptured = useAnimatedNumber(leads.length, 1100)
  const qualified = useAnimatedNumber(leads.filter((lead) => Number(lead.score || 0) >= 70).length, 1100)
  const visitsMade = useAnimatedNumber(appointments.filter((a) => String(a.status || '').toLowerCase().includes('confirm')).length, 1100)
  const proposals = useAnimatedNumber(leads.filter((lead) => String(lead.stage || '').toUpperCase() === 'PROPOSAL').length, 1100)
  const closings = useAnimatedNumber(leads.filter((lead) => String(lead.stage || '').toUpperCase() === 'CLOSING').length, 1100)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowCharts(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const funnelRows = [
    { label: 'Leads captados', val: leadsCaptured, pct: 100, color: '#3b82f6' },
    { label: 'Qualificados', val: qualified, pct: 62, color: '#8b5cf6' },
    { label: 'Visitas realizadas', val: visitsMade, pct: 38, color: '#f59e0b' },
    { label: 'Propostas', val: proposals, pct: 17, color: '#f97316' },
    { label: 'Fechamentos', val: closings, pct: 6, color: '#10b981' },
  ]
  const greetingByHour = getGreetingByHour(time.getHours())
  const displayName = String(userName || 'Usuário').split(' ')[0]
  const dateLabel = time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  const prettyDateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)
  const priorityFeed = useMemo(() => {
    const hotLeadActions = leads
      .filter((lead) => lead.score >= 80)
      .map((lead) => ({
        id: `lead-${lead.id}`,
        title: `Contato imediato: ${lead.name}`,
        desc: `Lead quente (${lead.score}) · ${lead.budget} · ${lead.region}`,
        score: Math.min(100, lead.score + 8),
        color: '#ef4444',
        tag: 'Lead quente',
      }))

    const delayedVisits = appointments
      .filter((visit) => visit.status !== 'confirmed')
      .map((visit, index) => ({
        id: `visit-${visit.id}`,
        title: `Visita pendente: ${visit.name}`,
        desc: `${visit.time} · ${visit.property}`,
        score: 72 - index * 4,
        color: '#f59e0b',
        tag: 'Visita atrasada',
      }))

    const proposalFollowUps = leads
      .filter((lead) => Number(lead.score || 0) < 80)
      .slice(0, 3)
      .map((lead, index) => ({
        id: `proposal-${lead.id}`,
        title: `Follow-up de proposta: ${lead.name}`,
        desc: `Sem retorno recente · ${lead.type}`,
        score: 68 - index * 3,
        color: '#8b5cf6',
        tag: 'Proposta sem retorno',
      }))

    const fromAlerts = alerts
      .filter((item) => item.title?.toLowerCase().includes('follow-up'))
      .slice(0, 2)
      .map((item, index) => ({
        id: `alert-${item.id || index}`,
        title: item.title,
        desc: item.desc,
        score: 64 - index * 2,
        color: '#3b82f6',
        tag: 'Alerta IA',
      }))

    return [...hotLeadActions, ...delayedVisits, ...proposalFollowUps, ...fromAlerts]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }, [alerts])

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, ...inViewStyle(ready, 0) }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>{greetingByHour}, {displayName} 👋</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{prettyDateLabel} · {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>{hotLeads} leads quentes</span>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon d={icons.whatsapp} size={14} stroke="#10b981" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>IA Ativa</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, ...inViewStyle(ready, 70) }}>
          <StatCard icon="chat" label="Leads Hoje" value={String(leadsToday)} delta={23} color="#3b82f6" bg="#eff6ff" />
        </div>
        <div style={{ flex: 1, ...inViewStyle(ready, 110) }}>
          <StatCard icon="calendar" label="Visitas Hoje" value={String(visitsToday)} delta={0} color="#8b5cf6" bg="#f5f3ff" />
        </div>
        <div style={{ flex: 1, ...inViewStyle(ready, 150) }}>
          <StatCard icon="funnel" label="Negociações Ativas" value={String(activeNegotiations)} delta={12} color="#f59e0b" bg="#fffbeb" />
        </div>
        <div style={{ flex: 1, ...inViewStyle(ready, 190) }}>
          <StatCard icon="chart" label="Fechados este mês" value={`R$ ${monthlyClosedMillions.toFixed(1)}M`} delta={8} color="#10b981" bg="#f0fdf4" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', ...inViewStyle(ready, 210) }}>
            <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Feed de prioridades do dia</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Top 5 ações</span>
            </div>
            <div style={{ padding: '6px 22px 12px' }}>
              {priorityFeed.map((item, index) => (
                <div key={item.id} style={{ borderBottom: index < priorityFeed.length - 1 ? '1px solid #f8fafc' : 'none', padding: '10px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: item.color }}>{item.score}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{item.desc}</div>
                  <div style={{ marginTop: 4, display: 'inline-block', borderRadius: 999, background: `${item.color}14`, color: item.color, fontSize: 9, fontWeight: 700, padding: '3px 7px' }}>{item.tag}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', ...inViewStyle(ready, 230) }}>
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
                    ...inViewStyle(ready, 260 + i * 45),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Avatar initials={l.avatar || String(l.name || 'L').slice(0, 2).toUpperCase()} color={l.color || '#3b82f6'} size={38} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.name || 'Lead'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{l.type || '-'} · {l.region || '-'} · {l.budget || '-'}</div>
                  </div>
                  <ScoreBadge score={l.score} />
                  <div style={{ fontSize: 11, color: '#cbd5e1', minWidth: 48, textAlign: 'right' }}>{l.time || '-'}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', ...inViewStyle(ready, 320) }}>
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Agenda de Hoje</span>
              <span onClick={onOpenCalendar} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>Abrir calendário →</span>
            </div>
            <div style={{ padding: '8px 22px 18px' }}>
              {appointments.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < appointments.length - 1 ? '1px solid #f8fafc' : 'none', ...inViewStyle(ready, 360 + i * 45) }}>
                  <div style={{ width: 48, textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: '#64748b' }}>{a.time || '-'}</div>
                  <div style={{ width: 3, height: 36, borderRadius: 4, background: String(a.status || '').toLowerCase().includes('confirm') ? '#10b981' : '#f59e0b', flexShrink: 0 }} />
                  <Avatar initials={a.avatar || String(a.name || 'A').slice(0, 2).toUpperCase()} color={a.color || '#3b82f6'} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{a.name || 'Compromisso'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.property || '-'}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: a.type === 'Visita' ? '#eff6ff' : '#f5f3ff', color: a.type === 'Visita' ? '#3b82f6' : '#8b5cf6' }}>{a.type || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#0f172a', borderRadius: 16, padding: '18px 20px', border: '1px solid #1e293b', ...inViewStyle(ready, 250) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#22c55e20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.zap} size={14} stroke="#22c55e" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>Alertas da IA</span>
              <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{alertsCount}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4, marginBottom: 8 }}>
              <button onClick={onClearAlerts} style={{ border: 'none', background: '#1e293b', color: '#94a3b8', borderRadius: 8, padding: '5px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Limpar alertas
              </button>
            </div>
            <div style={{ maxHeight: 240, overflowY: 'auto', paddingRight: 2 }}>
              {alerts.length === 0 && <div style={{ fontSize: 11, color: '#64748b', paddingBottom: 8 }}>Sem alertas da IA no momento.</div>}
              {alerts.map((n, i) => (
                <div key={n.id || i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < alerts.length - 1 ? '1px solid #1e293b' : 'none', ...inViewStyle(ready, 290 + i * 50) }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${n.bg}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon d={icons[n.icon]} size={14} stroke={n.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>{n.title}</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{n.desc}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{n.timeLabel || n.time}</div>
                  </div>
                  <button onClick={() => onDismissAlert?.(n.id)} style={{ width: 22, height: 22, borderRadius: 7, border: 'none', background: '#1e293b', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon d={icons.x} size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', ...inViewStyle(ready, 340) }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 16 }}>Funil do Mês</div>
            {funnelRows.map((row, idx) => (
              <div key={row.label} style={{ marginBottom: 10, ...inViewStyle(ready, 380 + idx * 55) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{row.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{row.val}</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: showCharts ? `${row.pct}%` : '0%', background: row.color, borderRadius: 4, transition: 'width 1s, filter 0.4s', filter: showCharts ? 'saturate(1)' : 'saturate(0.7)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', ...inViewStyle(ready, 400) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Previsão de comissão por corretor</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Meta mensal</div>
            </div>

            {commissionForecast.map((broker, idx) => {
              const pct = Math.min(100, Math.round((broker.projected / broker.meta) * 100))
              const missing = Math.max(0, broker.meta - broker.projected)
              return (
                <div key={broker.name} style={{ borderTop: idx === 0 ? 'none' : '1px solid #f8fafc', paddingTop: idx === 0 ? 0 : 12, marginTop: idx === 0 ? 0 : 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Avatar initials={broker.avatar} color={broker.color} size={30} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{broker.name}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>
                        Projeção: {formatCurrency(broker.projected)} · Falta: {formatCurrency(missing)}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: broker.color, fontFamily: "'DM Mono', monospace" }}>{pct}%</div>
                  </div>

                  <div style={{ height: 7, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: showCharts ? `${pct}%` : '0%', background: broker.color, borderRadius: 6, transition: `width 0.7s ease ${idx * 90}ms` }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                    <span>Meta: {formatCurrency(broker.meta)}</span>
                    <span>{pct >= 100 ? 'Meta batida' : 'Em progresso'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function getGreetingByHour(hour) {
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function inViewStyle(ready, delay = 0) {
  return {
    opacity: ready ? 1 : 0,
    transform: ready ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
  }
}

function useAnimatedNumber(target, duration = 1000) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const from = 0
    const to = Number(target) || 0

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      const next = from + (to - from) * eased
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return target % 1 === 0 ? Math.round(value) : Number(value.toFixed(1))
}

function formatCurrency(value) {
  return `R$ ${Number(value || 0).toLocaleString('pt-BR')}`
}
