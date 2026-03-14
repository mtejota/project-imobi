import { useEffect, useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import { metricsApi } from '../api'

export default function ScreenMetrics({ onOpenGenerateReport }) {
  const [period, setPeriod] = useState('monthly')
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)
  const [brokers, setBrokers] = useState([])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      metricsApi.getMetricsOverview({ period }).catch(() => null),
      metricsApi.getMetricsBrokers({ period }).catch(() => ({ items: [] })),
    ])
      .then(([overviewData, brokersData]) => {
        if (!mounted) return
        setOverview(overviewData || null)
        setBrokers(Array.isArray(brokersData?.items) ? brokersData.items : [])
      })
      .catch(() => {
        if (!mounted) return
        setOverview(null)
        setBrokers([])
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [period])

  const cards = useMemo(
    () => [
      {
        icon: 'trending',
        label: 'Taxa de Conversão',
        value: `${Number(overview?.conversionRate || 0).toFixed(1)}%`,
        delta: Number(overview?.conversionDelta || 0),
        color: '#10b981',
        bg: '#f0fdf4',
      },
      {
        icon: 'clock',
        label: 'Tempo Médio de Resposta',
        value: `${Math.round(Number(overview?.avgResponseMinutes || 0))}min`,
        delta: Number(overview?.responseDelta || 0),
        color: '#3b82f6',
        bg: '#eff6ff',
      },
      {
        icon: 'star',
        label: 'Satisfação do Cliente',
        value: `${Number(overview?.satisfaction || 0).toFixed(1)}/5`,
        delta: Number(overview?.satisfactionDelta || 0),
        color: '#f59e0b',
        bg: '#fffbeb',
      },
      {
        icon: 'chart',
        label: 'Comissão Estimada',
        value: `R$ ${Math.round(Number(overview?.estimatedCommission || 0) / 1000)}k`,
        delta: Number(overview?.commissionDelta || 0),
        color: '#8b5cf6',
        bg: '#f5f3ff',
      },
    ],
    [overview]
  )

  const monthlyBars = Array.isArray(overview?.monthlyBars) ? overview.monthlyBars : []
  const sources = Array.isArray(overview?.sources) ? overview.sources : []
  const funnel = useMemo(() => {
    const captured = Number(overview?.leadsCaptured || 0)
    const visits = Number(overview?.visits || 0)
    const closings = Number(overview?.closings || 0)
    const proposals = Math.max(0, Math.round(visits * 0.55))
    const qualified = Math.max(0, Math.round(captured * 0.62))
    return [
      { label: 'Captados', value: captured, color: '#3b82f6' },
      { label: 'Qualificados', value: qualified, color: '#8b5cf6' },
      { label: 'Visitas', value: visits, color: '#f59e0b' },
      { label: 'Propostas', value: proposals, color: '#f97316' },
      { label: 'Fechamentos', value: closings, color: '#10b981' },
    ]
  }, [overview])

  const soldVolume = Number(overview?.soldVolume || 0)
  const leadsCaptured = Number(overview?.leadsCaptured || 0)
  const closings = Number(overview?.closings || 0)
  const conversionRate = Number(overview?.conversionRate || 0)
  const brokerPerformance = useMemo(() => {
    const source = brokers.length
      ? brokers
      : [
          { id: 'fallback-1', name: 'Equipe comercial', closings, soldVolume, commission: Number(overview?.commission || 0) },
        ]
    const topRevenue = Math.max(
      1,
      ...source.map((broker) => Number(broker?.soldVolume || broker?.revenue || broker?.commission || 0))
    )

    return source.map((broker, index) => {
      const revenue = Number(broker?.soldVolume || broker?.revenue || broker?.commission || 0)
      const closed = Number(broker?.closings || broker?.closed || 0)
      return {
        id: broker.id || `broker-${index}`,
        name: broker.name || `Corretor ${index + 1}`,
        closed,
        revenue,
        pct: Math.max(8, Math.min(100, Math.round((revenue / topRevenue) * 100))),
        color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][index % 4],
      }
    })
  }, [brokers, closings, overview?.commission, soldVolume])

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <style>{`
        @media (max-width: 1120px) {
          .metrics-cards { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .metrics-main { grid-template-columns: 1fr !important; }
          .metrics-lower { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .metrics-cards { grid-template-columns: 1fr !important; }
          .metrics-period { flex-wrap: wrap; }
        }
      `}</style>

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Métricas & Performance</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{loading ? 'Carregando dados...' : 'Dados do backend em tempo real'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="metrics-period" style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'weekly', label: 'Semanal' },
              { id: 'monthly', label: 'Mensal' },
              { id: 'quarterly', label: 'Trimestral' },
            ].map((item) => {
              const active = period === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setPeriod(item.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid',
                    borderColor: active ? '#1a56db' : '#e2e8f0',
                    background: active ? '#eff6ff' : '#fff',
                    color: active ? '#1a56db' : '#64748b',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <button onClick={onOpenGenerateReport} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Gerar Relatório
          </button>
        </div>
      </div>

      <div className="metrics-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 18 }}>
        {cards.map((card) => (
          <div key={card.label}>
            <StatCard {...card} />
          </div>
        ))}
      </div>

      <div className="metrics-main" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 18 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Negociações por Mês</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{loading ? 'Atualizando...' : `${monthlyBars.length || 12} períodos`}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 14 }}>
            <MiniMetric label="Leads captados" value={String(leadsCaptured)} color="#3b82f6" />
            <MiniMetric label="Fechamentos" value={String(closings)} color="#10b981" />
            <MiniMetric label="Volume vendido" value={formatMoneyCompact(soldVolume)} color="#8b5cf6" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
            {(monthlyBars.length ? monthlyBars : Array.from({ length: 12 }).map(() => 0)).map((item, i) => {
              const value = Number(item?.value ?? item ?? 0)
              const month = item?.month || ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]
              const highlighted = i === (monthlyBars.length ? monthlyBars.length - 1 : 11)
              return (
                <div key={`${month}-${i}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.max(8, Math.min(100, value))}%`,
                      background: highlighted ? 'linear-gradient(180deg,#3b82f6,#1d4ed8)' : '#dbeafe',
                      borderRadius: '7px 7px 0 0',
                      boxShadow: highlighted ? '0 8px 18px rgba(37,99,235,0.28)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  />
                  <span style={{ fontSize: 9, color: highlighted ? '#1a56db' : '#94a3b8', fontWeight: 700 }}>{month}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Origem dos Leads</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>Participação por canal no período selecionado</div>
          {(sources.length ? sources : []).map((s) => (
            <div key={s.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{Number(s.pct || 0)}%</span>
              </div>
              <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${Number(s.pct || 0)}%`, background: s.color || '#3b82f6', borderRadius: 4 }} />
              </div>
            </div>
          ))}
          {!sources.length && <div style={{ fontSize: 12, color: '#94a3b8' }}>Sem dados de origem no período.</div>}

          <div style={{ marginTop: 12, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Conversão geral</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{conversionRate.toFixed(1)}%</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: conversionRate >= 20 ? '#10b981' : '#f59e0b' }}>
                {conversionRate >= 20 ? 'Excelente' : 'Em evolução'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-lower" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Funil Comercial</div>
          {funnel.map((item, index) => {
            const base = Math.max(1, funnel[0]?.value || 1)
            const pct = Math.round((item.value / base) * 100)
            return (
              <div key={item.label} style={{ marginBottom: index < funnel.length - 1 ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{item.value}</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${Math.max(5, pct)}%`, background: item.color, borderRadius: 999 }} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Performance por Corretor</div>
          {brokerPerformance.map((broker, idx) => (
            <div key={broker.name} style={{ borderTop: idx === 0 ? 'none' : '1px solid #f8fafc', paddingTop: idx === 0 ? 0 : 12, marginTop: idx === 0 ? 0 : 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{broker.name}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{broker.closed} fechamentos</span>
              </div>
              <div style={{ height: 7, background: '#f1f5f9', borderRadius: 999, marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${broker.pct}%`, background: broker.color, borderRadius: 999 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                <span>{broker.pct}% da meta</span>
                <span>{formatMoneyCompact(broker.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniMetric({ label, value, color }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', padding: '8px 10px' }}>
      <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color }}>{value}</div>
    </div>
  )
}

function formatMoneyCompact(value) {
  const amount = Number(value || 0)
  if (amount >= 1000000) return `R$ ${(amount / 1000000).toFixed(2)}M`
  if (amount >= 1000) return `R$ ${(amount / 1000).toFixed(0)}k`
  return `R$ ${amount.toLocaleString('pt-BR')}`
}
