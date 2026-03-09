import { useEffect, useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import { metricsApi } from '../api'

export default function ScreenMetrics({ onOpenGenerateReport }) {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    let mounted = true
    metricsApi
      .getMetricsOverview({ period: 'monthly' })
      .then((data) => {
        if (!mounted) return
        setOverview(data || null)
      })
      .catch(() => {
        if (!mounted) return
        setOverview(null)
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

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

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Métricas & Performance</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{loading ? 'Carregando dados...' : 'Dados do backend em tempo real'}</div>
        </div>
        <button onClick={onOpenGenerateReport} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Gerar Relatório
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {cards.map((card) => (
          <div key={card.label} style={{ flex: 1 }}>
            <StatCard {...card} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 18 }}>Negociações por Mês</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
            {(monthlyBars.length ? monthlyBars : Array.from({ length: 12 }).map(() => 0)).map((item, i) => {
              const value = Number(item?.value ?? item ?? 0)
              const month = item?.month || ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]
              return (
                <div key={`${month}-${i}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', height: `${Math.max(6, Math.min(100, value))}%`, background: '#dbeafe', borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{month}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Origem dos Leads</div>
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
        </div>
      </div>
    </div>
  )
}
