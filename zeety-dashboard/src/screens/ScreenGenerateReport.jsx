import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'
import { metricsApi } from '../api'
import { buildReportPayload, exportReportPdf } from '../services/pdfExportService'

const PERIODS = ['Março 2026', 'Fevereiro 2026', 'Janeiro 2026', '1º Trimestre 2026', '2026 (acumulado)']
const SECTIONS = [
  { id: 'kpis', label: 'KPIs Gerais', checked: true },
  { id: 'funnel', label: 'Funil de Conversão', checked: true },
  { id: 'sources', label: 'Origem de Leads', checked: true },
  { id: 'brokers', label: 'Ranking de Corretores', checked: true },
]

export default function ScreenGenerateReport({ onBack }) {
  const [period, setPeriod] = useState(PERIODS[0])
  const [sections, setSections] = useState(SECTIONS)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [exportError, setExportError] = useState('')
  const [data, setData] = useState({ kpis: [], funnel: [], sources: [], brokers: [] })

  const selectedSections = useMemo(() => sections.filter((s) => s.checked).map((s) => s.id), [sections])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      metricsApi.getMetricsOverview({ period }).catch(() => ({})),
      metricsApi.getMetricsFunnel({ period }).catch(() => ({ items: [] })),
      metricsApi.getMetricsSources({ period }).catch(() => ({ items: [] })),
      metricsApi.getMetricsBrokers({ period }).catch(() => ({ items: [] })),
    ])
      .then(([overview, funnel, sources, brokers]) => {
        if (!mounted) return
        setData({
          kpis: [
            { label: 'Leads captados', value: overview?.leadsCaptured || 0 },
            { label: 'Visitas', value: overview?.visits || 0 },
            { label: 'Fechamentos', value: overview?.closings || 0 },
            { label: 'Volume vendido', value: overview?.soldVolume || 0 },
            { label: 'Comissão gerada', value: overview?.commission || 0 },
          ],
          funnel: Array.isArray(funnel) ? funnel : funnel.items || [],
          sources: Array.isArray(sources) ? sources : sources.items || [],
          brokers: Array.isArray(brokers) ? brokers : brokers.items || [],
        })
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [period])

  const toggleSection = (id) => setSections((s) => s.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)))

  const handleGenerate = () => {
    setExportError('')
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 700)
  }

  const handleExportPdf = async () => {
    setExportError('')
    setExportingPdf(true)

    const payload = buildReportPayload({ period, sections: selectedSections, metrics: data })

    try {
      await exportReportPdf(payload)
    } catch (error) {
      setExportError(error?.message || 'Não foi possível exportar o PDF.')
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '24px 24px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
              <Icon d={icons.back} size={15} /> Métricas
            </button>
            <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Gerar Relatório</span>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>KPIs — {period}</div>
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, border: '1px solid #bfdbfe' }}>{loading ? 'Carregando...' : 'Dados atualizados'}</span>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {data.kpis.map((kpi) => (
                <div key={kpi.label} style={{ flex: 1, background: '#f8fafc', borderRadius: 14, padding: '16px 14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1a56db' }}>{formatValue(kpi.value)}</div>
                  <div style={{ fontSize: 10, color: '#374151', marginTop: 6, fontWeight: 600 }}>{kpi.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Período</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PERIODS.map((p) => (
                <button key={p} onClick={() => setPeriod(p)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `2px solid ${period === p ? '#1a56db' : '#f1f5f9'}`, background: period === p ? '#eff6ff' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: period === p ? 700 : 500, color: period === p ? '#1a56db' : '#374151', fontFamily: 'inherit' }}>
                  {p}
                  {period === p && <Icon d={icons.check} size={13} stroke="#1a56db" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Incluir no relatório</div>
            {sections.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <button onClick={() => toggleSection(s.id)} style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${s.checked ? '#1a56db' : '#e2e8f0'}`, background: s.checked ? '#1a56db' : '#fff', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.checked && <Icon d={icons.check} size={11} stroke="#fff" strokeWidth={3} />}
                </button>
                <span style={{ fontSize: 12, color: s.checked ? '#374151' : '#94a3b8', fontWeight: s.checked ? 600 : 400 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {generated ? (
            <div style={{ background: '#f0fdf4', borderRadius: 16, padding: 20, border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', marginBottom: 4 }}>Relatório gerado!</div>
              <button onClick={handleExportPdf} disabled={exportingPdf} style={{ width: '100%', marginTop: 10, padding: 11, borderRadius: 12, border: exportError ? '1px solid #ef4444' : 'none', background: exportError ? '#ef4444' : exportingPdf ? '#6ee7b7' : '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: exportingPdf ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                {exportingPdf ? (
                  <>Exportando PDF...</>
                ) : (
                  <>
                    <Icon d={exportError ? icons.alert : icons.download} size={15} stroke="#fff" /> {exportError ? 'ERRO AO GERAR RELATÓRIO' : 'Baixar agora'}
                  </>
                )}
              </button>
              {exportError && <div style={{ marginTop: 10, fontSize: 11, color: '#b91c1c' }}>Falha ao gerar o PDF. Entre em contato com o suporte.</div>}
            </div>
          ) : (
            <button onClick={handleGenerate} disabled={generating || loading} style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: generating || loading ? '#94a3b8' : 'linear-gradient(135deg, #1a56db, #3b82f6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: generating || loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit' }}>
              {generating ? 'Gerando relatório...' : 'Exportar PDF'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function formatValue(value) {
  const n = Number(value)
  if (Number.isFinite(n)) {
    if (n >= 1000000) return `R$ ${(n / 1000000).toFixed(2)}M`
    if (n >= 1000) return `R$ ${(n / 1000).toFixed(0)}k`
    return String(n)
  }
  return String(value || 0)
}
