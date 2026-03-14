import { useEffect, useMemo, useState } from 'react'
import Avatar from '../components/Avatar'
import StatCard from '../components/StatCard'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'


export default function ScreenDashboard({
  onOpenCalendar,
  onOpenPipeline,
  onOpenMetrics,
  userName = 'Usuário',
  alerts = [],
  onDismissAlert,
  onClearAlerts,
  leads = [],
  appointments = [],
  pipelineData = {},
}) {
  const [time, setTime] = useState(new Date())
  const [showCharts, setShowCharts] = useState(false)
  const [ready, setReady] = useState(false)

  const hotLeads = useAnimatedNumber(leads.filter((lead) => Number(lead.score || 0) >= 80).length, 900)
  const alertsCount = alerts.length
  const leadsToday = useAnimatedNumber(leads.length, 1000)
  const visitsToday = useAnimatedNumber(appointments.length, 1000)
  const qualifiedLeadsCount = leads.filter((lead) => Number(lead.score || 0) >= 70).length
  const qualifiedLeads = useAnimatedNumber(qualifiedLeadsCount, 1000)
  const qualificationRate = leads.length > 0 ? Math.round((qualifiedLeadsCount / leads.length) * 100) : 0
  const aiAlerts = useAnimatedNumber(alertsCount, 900)
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
  const headlineByHour =
    time.getHours() < 12
      ? 'Vamos organizar seu dia de vendas com foco total.'
      : time.getHours() < 18
        ? 'Hora de acelerar follow-ups e avançar negociações.'
        : 'Último giro do dia para garantir oportunidades.'
  const compactDateLabel = `${time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })}`
    .replace(/^./, (char) => char.toUpperCase())
    .replace('-feira', '')
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
  }, [alerts, appointments, leads])

  const pipelineCards = useMemo(
    () =>
      Object.values(pipelineData || {}).flatMap((stageCards) =>
        Array.isArray(stageCards) ? stageCards : []
      ),
    [pipelineData]
  )
  const pipelineNegotiations = pipelineCards.length
  const pipelinePortfolioValue = pipelineCards.reduce((sum, card) => sum + parseMoney(card.value), 0)

  const fallbackNegotiations = leads.filter((lead) => ['PROPOSAL', 'NEGOTIATION', 'CLOSING'].includes(String(lead.stage || '').toUpperCase())).length
  const fallbackPortfolioValue = leads.reduce((sum, lead) => sum + parseMoney(lead.budget), 0)

  const negotiationsCurrent = pipelineNegotiations > 0 ? pipelineNegotiations : fallbackNegotiations
  const negotiationsPortfolioValue = pipelinePortfolioValue > 0 ? pipelinePortfolioValue : fallbackPortfolioValue
  const negotiationsPrevious = Math.max(1, Math.round(negotiationsCurrent * 0.84))
  const negotiationsDelta = ((negotiationsCurrent - negotiationsPrevious) / negotiationsPrevious) * 100

  const commissionRate = 0.02
  const commissionEstimatedTotal = useMemo(() => negotiationsPortfolioValue * commissionRate, [negotiationsPortfolioValue])
  const commissionCurrent = commissionEstimatedTotal || negotiationsPortfolioValue * commissionRate
  const commissionPrevious = Math.max(1, Math.round(commissionCurrent * 0.84))
  const commissionDelta = ((commissionCurrent - commissionPrevious) / commissionPrevious) * 100
  const commissionStatus = 'a receber'

  const negotiationSeriesCurrent = [
    { x: 1, y: 5 },
    { x: 5, y: 6 },
    { x: 10, y: 7 },
    { x: 15, y: 7 },
    { x: 20, y: 8 },
    { x: 25, y: 9 },
    { x: 30, y: negotiationsCurrent },
  ]
  const negotiationSeriesPrevious = [
    { x: 1, y: 4 },
    { x: 5, y: 4 },
    { x: 10, y: 5 },
    { x: 15, y: 5 },
    { x: 20, y: 6 },
    { x: 25, y: 6 },
    { x: 28, y: 6 },
    { x: 30, y: negotiationsPrevious },
  ]
  const commissionSeries = [
    { x: 1, y: commissionCurrent * 0.46 },
    { x: 5, y: commissionCurrent * 0.58 },
    { x: 10, y: commissionCurrent * 0.66 },
    { x: 15, y: commissionCurrent * 0.74 },
    { x: 20, y: commissionCurrent * 0.82 },
    { x: 25, y: commissionCurrent * 0.91 },
    { x: 30, y: commissionCurrent },
  ]
  const commissionReferenceSeries = [
    { x: 1, y: commissionPrevious * 0.48 },
    { x: 5, y: commissionPrevious * 0.56 },
    { x: 10, y: commissionPrevious * 0.63 },
    { x: 15, y: commissionPrevious * 0.71 },
    { x: 20, y: commissionPrevious * 0.79 },
    { x: 25, y: commissionPrevious * 0.88 },
    { x: 30, y: commissionPrevious },
  ]

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, ...inViewStyle(ready, 0) }}>
        <div>
          <div style={{ fontSize: 23, fontWeight: 800, color: '#0f172a' }}>
            {greetingByHour},{' '}
            <span style={{ color: '#1a56db' }}>{displayName}</span>
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 3, fontWeight: 600 }}>{headlineByHour}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#1d4ed8', marginTop: 6, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 999, padding: '4px 10px', fontWeight: 700 }}>
            <Icon d={icons.calendar} size={12} stroke="#1d4ed8" />
            <span>{compactDateLabel} · {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>{hotLeads} leads quentes</span>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src="/zeety-logo.svg" alt="Zeety" style={{ width: 16, height: 16, display: 'block' }} />
              </div>
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
          <StatCard icon="funnel" label="Leads Qualificados" value={String(qualifiedLeads)} delta={qualificationRate} color="#f59e0b" bg="#fffbeb" />
        </div>
        <div style={{ flex: 1, ...inViewStyle(ready, 190) }}>
          <StatCard icon="bell" label="Alertas da IA" value={String(aiAlerts)} delta={alertsCount > 0 ? 5 : 0} color="#10b981" bg="#f0fdf4" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: 16, marginBottom: 24 }}>
        <ComparisonMetricCard
          title="Negociações Ativas"
          value={formatCurrency(negotiationsPortfolioValue)}
          valueSuffix={`${negotiationsCurrent} ativas`}
          delta={negotiationsDelta}
          previousLabel={`${formatCurrency(Math.round(negotiationsPortfolioValue * 0.84))} no período anterior`}
          primaryColor="#f97316"
          secondaryColor="#94a3b8"
          currentSeries={negotiationSeriesCurrent}
          previousSeries={negotiationSeriesPrevious}
          xLabels={['1', '5', '10', '15', '20', '25', '30']}
          onOpen={onOpenPipeline}
          ctaLabel="Ver pipeline"
          tipText={`+${Math.max(0, negotiationsCurrent - negotiationsPrevious)} negociações neste ciclo`}
          delay={205}
          ready={ready}
        />

        <ComparisonMetricCard
          title="Comissão Projetada"
          value={formatCurrency(commissionCurrent)}
          valueSuffix={commissionStatus}
          delta={commissionDelta}
          previousLabel={`${formatCurrency(commissionPrevious)} no período anterior`}
          primaryColor="#3b82f6"
          secondaryColor="#9ca3af"
          currentSeries={commissionSeries}
          previousSeries={commissionReferenceSeries}
          xLabels={['1', '5', '10', '15', '20', '25', '30']}
          yFormatter={(tick) => formatCurrency(Math.round(tick))}
          onOpen={onOpenMetrics}
          ctaLabel="Ver métricas"
          tipText={`Comissão variou ${commissionDelta >= 0 ? '+' : ''}${commissionDelta.toFixed(1)}%`}
          delay={215}
          ready={ready}
        />
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
          <div style={{ background: '#ffffff', borderRadius: 16, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', ...inViewStyle(ready, 250) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.zap} size={14} stroke="#22c55e" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Alertas da IA</span>
              <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{alertsCount}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4, marginBottom: 8 }}>
              <button onClick={onClearAlerts} style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', borderRadius: 8, padding: '5px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Limpar alertas
              </button>
            </div>
            <div style={{ maxHeight: 240, overflowY: 'auto', paddingRight: 2 }}>
              {alerts.length === 0 && <div style={{ fontSize: 11, color: '#64748b', paddingBottom: 8 }}>Sem alertas da IA no momento.</div>}
              {alerts.map((n, i) => (
                <div key={n.id || i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < alerts.length - 1 ? '1px solid #f1f5f9' : 'none', ...inViewStyle(ready, 290 + i * 50) }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: n.bg || '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon d={icons[n.icon]} size={14} stroke={n.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{n.desc}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{n.timeLabel || n.time}</div>
                  </div>
                  <button onClick={() => onDismissAlert?.(n.id)} style={{ width: 22, height: 22, borderRadius: 7, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

        </div>
      </div>
    </div>
  )
}

function ComparisonMetricCard({
  title,
  value,
  valueSuffix,
  delta,
  previousLabel,
  primaryColor,
  secondaryColor,
  currentSeries = [],
  previousSeries = [],
  onOpen,
  ctaLabel,
  tipText,
  xLabels,
  yTicks,
  yFormatter,
  yMin,
  yMax,
  ready,
  delay = 0,
}) {
  const deltaPositive = delta >= 0
  const chartHeight = 132
  const chartWidth = 100
  const allValues = [...currentSeries, ...previousSeries].map((point) =>
    typeof point === 'number' ? point : Number(point?.y || point?.cumulative || 0)
  )
  const computedMax = Math.max(...allValues, 1)
  const computedMin = Math.max(0, Math.min(...allValues) - (computedMax - Math.min(...allValues)) * 0.18)
  const max = typeof yMax === 'number' ? yMax : computedMax
  const min = typeof yMin === 'number' ? yMin : computedMin
  const range = Math.max(max - min, 1)
  const currentPoints = seriesToPoints(currentSeries, chartWidth, chartHeight, min, range)
  const previousPoints = seriesToPoints(previousSeries, chartWidth, chartHeight, min, range)
  const currentArea = buildAreaPath(currentPoints, chartWidth, chartHeight)
  const previousArea = buildAreaPath(previousPoints, chartWidth, chartHeight)
  const labels = xLabels || (currentSeries.length === 7 ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'] : ['1', '5', '10', '15', '20', '25', '30'])
  const axisTicks = yTicks && yTicks.length ? yTicks : [min, min + range * 0.33, min + range * 0.66, max]
  const formatYAxis = yFormatter || ((tick) => formatCurrency(tick))

  return (
    <button
      onClick={onOpen}
      style={{
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        borderRadius: 18,
        padding: 18,
        color: '#0f172a',
        cursor: onOpen ? 'pointer' : 'default',
        textAlign: 'left',
        width: '100%',
        boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
        ...inViewStyle(ready, delay),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b' }}>{title}</div>
        <span style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 700 }}>{ctaLabel} ↗</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1, color: '#0f172a' }}>{value}</div>
        {valueSuffix && <span style={{ fontSize: 20, color: '#475569', fontWeight: 500 }}>{valueSuffix}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderRadius: 10,
            padding: '5px 10px',
            fontSize: 11,
            fontWeight: 800,
            background: deltaPositive ? '#dcfce7' : '#fee2e2',
            color: deltaPositive ? '#15803d' : '#dc2626',
          }}
        >
          {deltaPositive ? '↗' : '↘'} {deltaPositive ? '+' : ''}
          {delta.toFixed(1)}%
        </span>
        <span style={{ fontSize: 12, color: '#64748b' }}>vs {previousLabel}</span>
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 6, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: 4, paddingBottom: 8 }}>
            {[...axisTicks].reverse().map((tick, idx) => (
              <span key={idx} style={{ fontSize: 11, color: '#94a3b8' }}>{formatYAxis(tick)}</span>
            ))}
          </div>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 130 }}>
            {axisTicks.map((tick, idx) => {
              const y = scaleY(tick, chartHeight, min, range)
              return <line key={idx} x1="0" y1={y} x2={chartWidth} y2={y} stroke="rgba(148,163,184,0.35)" strokeWidth="0.6" />
            })}
            {previousSeries.length > 1 && (
              <path d={previousArea} fill={`${secondaryColor}1e`} />
            )}
            {currentSeries.length > 1 && <path d={currentArea} fill={`${primaryColor}26`} />}
            {previousSeries.length > 1 && (
              <polyline
                fill="none"
                stroke={secondaryColor}
                strokeDasharray="3 3"
                strokeWidth="1.4"
                points={previousPoints}
              />
            )}
            {currentSeries.length > 1 && (
              <>
                <polyline
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.8"
                  points={currentPoints}
                />
                <circle
                  cx={getLastPoint(currentSeries, chartWidth).x}
                  cy={scaleY(
                    typeof currentSeries[currentSeries.length - 1] === 'number'
                      ? currentSeries[currentSeries.length - 1]
                      : Number(currentSeries[currentSeries.length - 1]?.y || currentSeries[currentSeries.length - 1]?.cumulative || 0),
                    chartHeight,
                    min,
                    range
                  )}
                  r="2.2"
                  fill={primaryColor}
                />
              </>
            )}
          </svg>
        </div>

        <div style={{ marginLeft: 62, display: 'grid', gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: 4, marginTop: 2 }}>
          {labels.map((label) => (
            <span key={label} style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>{label}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#334155' }}>
          <span style={{ width: 14, height: 2, borderRadius: 4, background: primaryColor }} />
          <span>Período atual</span>
        </div>
        {previousSeries.length > 1 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
            <span style={{ width: 14, height: 2, borderRadius: 4, background: secondaryColor }} />
            <span>Período anterior</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', borderRadius: 999, padding: '7px 12px', fontSize: 12, fontWeight: 600 }}>
        <span style={{ color: '#2563eb' }}>✦</span>
        <span>{tipText}</span>
      </div>
    </button>
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

function parseMoney(value) {
  if (!value) return 0
  const raw = String(value).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  const amount = Number(raw)
  return Number.isFinite(amount) ? amount : 0
}

function seriesToPoints(series, width, height, min, range) {
  const maxX = getSeriesMaxX(series)
  return series
    .map((point, index) => {
      const pointX = typeof point === 'number' ? index + 1 : Number(point?.x || point?.day || index + 1)
      const pointY = typeof point === 'number' ? point : Number(point?.y || point?.cumulative || 0)
      const x = (pointX / Math.max(maxX, 1)) * (width - 2) + 1
      const y = scaleY(pointY, height, min, range)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function scaleY(value, height, min, range) {
  const usableHeight = height - 16
  return usableHeight - ((value - min) / range) * usableHeight + 8
}

function getLastPoint(series, width) {
  const index = Math.max(0, series.length - 1)
  const maxX = getSeriesMaxX(series)
  const last = series[index]
  const pointX = typeof last === 'number' ? index + 1 : Number(last?.x || last?.day || index + 1)
  const x = (pointX / Math.max(maxX, 1)) * (width - 2) + 1
  return { x }
}

function buildAreaPath(points, width, height) {
  if (!points) return ''
  const first = points.split(' ')[0]
  const last = points.split(' ').slice(-1)[0]
  return `M ${first} L ${points.split(' ').slice(1).join(' ')} L ${last.split(',')[0]},${height - 8} L ${first.split(',')[0]},${height - 8} Z`
}

function getSeriesMaxX(series = []) {
  if (!series.length) return 1
  const candidate = series.reduce((max, point, index) => {
    const value = typeof point === 'number' ? index + 1 : Number(point?.x || point?.day || index + 1)
    return Math.max(max, value)
  }, 1)
  return Math.max(candidate, series.length)
}
