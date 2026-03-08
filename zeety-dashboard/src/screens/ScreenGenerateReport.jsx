import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'
import { buildReportPayload, exportReportPdf } from '../services/pdfExportService'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const barData = [42, 58, 65, 71, 54, 80, 73, 88, 62, 79, 85, 91]
const funnelData = [
  { label: 'Leads', val: 187, pct: 100, color: '#3b82f6' },
  { label: 'Qualif.', val: 124, pct: 66, color: '#8b5cf6' },
  { label: 'Visitas', val: 72, pct: 39, color: '#f59e0b' },
  { label: 'Propostas', val: 31, pct: 17, color: '#f97316' },
  { label: 'Fechados', val: 12, pct: 6, color: '#10b981' },
]
const sourceData = [
  { label: 'WhatsApp', pct: 38, color: '#10b981' },
  { label: 'ZAP/Viva', pct: 27, color: '#3b82f6' },
  { label: 'Indicações', pct: 20, color: '#8b5cf6' },
  { label: 'Site', pct: 10, color: '#f59e0b' },
  { label: 'Outros', pct: 5, color: '#94a3b8' },
]
const brokers = [
  { name: 'Lucas Correia', leads: 47, fechados: 5, commission: 'R$ 89.400', rate: '10.6%', avatar: 'LC', color: '#1a56db' },
  { name: 'Ana Paula', leads: 38, fechados: 4, commission: 'R$ 62.100', rate: '10.5%', avatar: 'AP', color: '#8b5cf6' },
  { name: 'Marcos Vieira', leads: 29, fechados: 2, commission: 'R$ 48.000', rate: '6.9%', avatar: 'MV', color: '#f59e0b' },
  { name: 'Carla Souza', leads: 23, fechados: 1, commission: 'R$ 22.500', rate: '4.3%', avatar: 'CS', color: '#10b981' },
]
const KPI_BASE = [
  { label: 'Leads captados', value: '47', delta: '+23%', color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Visitas', value: '18', delta: '+12%', color: '#8b5cf6', bg: '#f5f3ff' },
  { label: 'Fechamentos', value: '5', delta: '+8%', color: '#10b981', bg: '#f0fdf4' },
  { label: 'Volume vendido', value: 'R$ 3.75M', delta: '+15%', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Comissão gerada', value: 'R$ 89k', delta: '+18%', color: '#ef4444', bg: '#fef2f2' },
]
const PERIOD_DATA = {
  'Março 2026': {
    kpis: KPI_BASE,
    barData,
    funnelData,
    sourceData,
    brokers,
  },
  'Fevereiro 2026': {
    kpis: [
      { ...KPI_BASE[0], value: '39', delta: '+11%' },
      { ...KPI_BASE[1], value: '15', delta: '+7%' },
      { ...KPI_BASE[2], value: '4', delta: '+5%' },
      { ...KPI_BASE[3], value: 'R$ 3.10M', delta: '+8%' },
      { ...KPI_BASE[4], value: 'R$ 74k', delta: '+9%' },
    ],
    barData: [38, 52, 58, 66, 49, 74, 69, 81, 57, 72, 78, 84],
    funnelData: [
      { ...funnelData[0], val: 164 },
      { ...funnelData[1], val: 109, pct: 65 },
      { ...funnelData[2], val: 61, pct: 37 },
      { ...funnelData[3], val: 26, pct: 16 },
      { ...funnelData[4], val: 10, pct: 6 },
    ],
    sourceData: [
      { ...sourceData[0], pct: 35 },
      { ...sourceData[1], pct: 30 },
      { ...sourceData[2], pct: 19 },
      { ...sourceData[3], pct: 11 },
      { ...sourceData[4], pct: 5 },
    ],
    brokers: [
      { ...brokers[0], leads: 41, fechados: 4, commission: 'R$ 73.100', rate: '9.8%' },
      { ...brokers[1], leads: 34, fechados: 3, commission: 'R$ 55.400', rate: '8.8%' },
      { ...brokers[2], leads: 24, fechados: 2, commission: 'R$ 40.900', rate: '8.3%' },
      { ...brokers[3], leads: 19, fechados: 1, commission: 'R$ 19.200', rate: '5.2%' },
    ],
  },
  'Janeiro 2026': {
    kpis: [
      { ...KPI_BASE[0], value: '32', delta: '+6%' },
      { ...KPI_BASE[1], value: '12', delta: '+4%' },
      { ...KPI_BASE[2], value: '3', delta: '+2%' },
      { ...KPI_BASE[3], value: 'R$ 2.55M', delta: '+5%' },
      { ...KPI_BASE[4], value: 'R$ 61k', delta: '+6%' },
    ],
    barData: [34, 46, 52, 60, 44, 68, 62, 73, 49, 67, 71, 78],
    funnelData: [
      { ...funnelData[0], val: 142 },
      { ...funnelData[1], val: 91, pct: 64 },
      { ...funnelData[2], val: 53, pct: 37 },
      { ...funnelData[3], val: 21, pct: 15 },
      { ...funnelData[4], val: 8, pct: 6 },
    ],
    sourceData: [
      { ...sourceData[0], pct: 33 },
      { ...sourceData[1], pct: 29 },
      { ...sourceData[2], pct: 23 },
      { ...sourceData[3], pct: 10 },
      { ...sourceData[4], pct: 5 },
    ],
    brokers: [
      { ...brokers[0], leads: 33, fechados: 3, commission: 'R$ 58.700', rate: '9.1%' },
      { ...brokers[1], leads: 29, fechados: 3, commission: 'R$ 49.600', rate: '8.9%' },
      { ...brokers[2], leads: 21, fechados: 1, commission: 'R$ 28.400', rate: '4.8%' },
      { ...brokers[3], leads: 17, fechados: 1, commission: 'R$ 16.900', rate: '4.7%' },
    ],
  },
  '1º Trimestre 2026': {
    kpis: [
      { ...KPI_BASE[0], value: '118', delta: '+19%' },
      { ...KPI_BASE[1], value: '45', delta: '+10%' },
      { ...KPI_BASE[2], value: '12', delta: '+9%' },
      { ...KPI_BASE[3], value: 'R$ 9.40M', delta: '+13%' },
      { ...KPI_BASE[4], value: 'R$ 224k', delta: '+14%' },
    ],
    barData: [46, 63, 71, 82, 64, 89, 84, 95, 73, 87, 92, 98],
    funnelData: [
      { ...funnelData[0], val: 493 },
      { ...funnelData[1], val: 324, pct: 66 },
      { ...funnelData[2], val: 186, pct: 38 },
      { ...funnelData[3], val: 78, pct: 16 },
      { ...funnelData[4], val: 30, pct: 6 },
    ],
    sourceData: sourceData,
    brokers: [
      { ...brokers[0], leads: 121, fechados: 12, commission: 'R$ 221.200', rate: '9.9%' },
      { ...brokers[1], leads: 101, fechados: 10, commission: 'R$ 167.100', rate: '9.4%' },
      { ...brokers[2], leads: 74, fechados: 5, commission: 'R$ 117.300', rate: '6.7%' },
      { ...brokers[3], leads: 59, fechados: 3, commission: 'R$ 58.600', rate: '5.1%' },
    ],
  },
  '2026 (acumulado)': {
    kpis: [
      { ...KPI_BASE[0], value: '371', delta: '+21%' },
      { ...KPI_BASE[1], value: '142', delta: '+13%' },
      { ...KPI_BASE[2], value: '39', delta: '+11%' },
      { ...KPI_BASE[3], value: 'R$ 28.70M', delta: '+16%' },
      { ...KPI_BASE[4], value: 'R$ 671k', delta: '+17%' },
    ],
    barData: [52, 68, 76, 88, 74, 93, 87, 98, 80, 92, 95, 100],
    funnelData: [
      { ...funnelData[0], val: 1290 },
      { ...funnelData[1], val: 842, pct: 65 },
      { ...funnelData[2], val: 478, pct: 37 },
      { ...funnelData[3], val: 199, pct: 15 },
      { ...funnelData[4], val: 77, pct: 6 },
    ],
    sourceData: [
      { ...sourceData[0], pct: 40 },
      { ...sourceData[1], pct: 26 },
      { ...sourceData[2], pct: 19 },
      { ...sourceData[3], pct: 10 },
      { ...sourceData[4], pct: 5 },
    ],
    brokers: [
      { ...brokers[0], leads: 329, fechados: 31, commission: 'R$ 612.900', rate: '9.4%' },
      { ...brokers[1], leads: 286, fechados: 27, commission: 'R$ 474.800', rate: '9.4%' },
      { ...brokers[2], leads: 214, fechados: 13, commission: 'R$ 289.700', rate: '6.1%' },
      { ...brokers[3], leads: 181, fechados: 9, commission: 'R$ 182.500', rate: '5.0%' },
    ],
  },
}

const SECTIONS = [
  { id: 'kpis', label: 'KPIs Gerais', checked: true },
  { id: 'funnel', label: 'Funil de Conversão', checked: true },
  { id: 'sources', label: 'Origem de Leads', checked: true },
  { id: 'brokers', label: 'Ranking de Corretores', checked: true },
  { id: 'commiss', label: 'Comissões', checked: true },
  { id: 'chart', label: 'Gráfico Mensal', checked: false },
]

export default function ScreenGenerateReport({ onBack }) {
  const [period, setPeriod] = useState('Março 2026')
  const [sections, setSections] = useState(SECTIONS)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [exportError, setExportError] = useState('')
  const [animate, setAnimate] = useState(false)
  const currentData = PERIOD_DATA[period] || PERIOD_DATA['Março 2026']

  const toggleSection = (id) => setSections((s) => s.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)))

  const handleGenerate = () => {
    setExportError('')
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 1600)
  }

  const handleExportPdf = async () => {
    setExportError('')
    setExportingPdf(true)

    const payload = buildReportPayload({
      period,
      sections: sections.filter((s) => s.checked).map((s) => s.id),
      metrics: currentData,
    })

    try {
      await exportReportPdf(payload)
    } catch (error) {
      setExportError(error?.message || 'Não foi possível exportar o PDF.')
    } finally {
      setExportingPdf(false)
    }
  }

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '24px 24px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...enter(animate, 0) }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
              <Icon d={icons.back} size={15} /> Métricas
            </button>
            <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Gerar Relatório</span>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 60) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>KPIs — {period}</div>
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', fontWeight: 700, border: '1px solid #bbf7d0' }}>Atualizado agora</span>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {currentData.kpis.map(({ label, value, delta, color, bg }, index) => (
                <div key={label} style={{ flex: 1, background: bg, borderRadius: 14, padding: '16px 14px', border: `1px solid ${color}20`, ...enter(animate, 80 + index * 25) }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10, color: '#374151', marginTop: 6, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 10, color, marginTop: 4, fontWeight: 700 }}>{delta} vs mês ant.</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 150) }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Negociações por Mês — 2026</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
              {currentData.barData.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: '100%', height: animate ? Math.floor(b * 1.3) : 6, borderRadius: '5px 5px 0 0', background: i === 2 ? '#1a56db' : '#dbeafe', transition: `height 0.5s ease ${i * 25}ms` }} />
                  <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 210) }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Funil de Conversão</div>
              {currentData.funnelData.map((f, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{f.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{f.val}</span>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: animate ? `${f.pct}%` : '0%', background: f.color, borderRadius: 4, transition: `width 0.6s ease ${i * 70}ms` }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 250) }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Origem dos Leads</div>
              {currentData.sourceData.map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 11, color: '#64748b' }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: animate ? `${s.pct}%` : '0%', background: s.color, borderRadius: 4, transition: `width 0.6s ease ${i * 70}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 290) }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f8fafc', fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Ranking de Corretores</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr', padding: '10px 22px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Corretor', 'Leads', 'Fechados', 'Comissão', 'Taxa Conv.'].map((h) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </span>
              ))}
            </div>
            {currentData.brokers.map((b, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr', padding: '13px 22px', alignItems: 'center', borderBottom: i < brokers.length - 1 ? '1px solid #f8fafc' : 'none', ...enter(animate, 320 + i * 35) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${b.color}20`, border: `2px solid ${b.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: b.color }}>{b.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{b.name}</div>
                    {i === 0 && <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>Top corretor</div>}
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', fontFamily: "'DM Mono', monospace" }}>{b.leads}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', fontFamily: "'DM Mono', monospace" }}>{b.fechados}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a56db', fontFamily: "'DM Mono', monospace" }}>{b.commission}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{b.rate}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 110) }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Período</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Março 2026', 'Fevereiro 2026', 'Janeiro 2026', '1º Trimestre 2026', '2026 (acumulado)'].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `2px solid ${period === p ? '#1a56db' : '#f1f5f9'}`, background: period === p ? '#eff6ff' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: period === p ? 700 : 500, color: period === p ? '#1a56db' : '#374151', fontFamily: 'inherit' }}>
                  {p}
                  {period === p && <Icon d={icons.check} size={13} stroke="#1a56db" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 150) }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Formato</div>
            <div style={{ border: '2px solid #1a56db', background: '#eff6ff', color: '#1a56db', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800 }}>
              <Icon d={icons.file} size={16} stroke="#1a56db" />
              PDF (padrão do sistema)
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', ...enter(animate, 190) }}>
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
            <div style={{ background: '#f0fdf4', borderRadius: 16, padding: 20, border: '1px solid #bbf7d0', textAlign: 'center', ...enter(animate, 230) }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', marginBottom: 4 }}>Relatório gerado!</div>
              <div style={{ fontSize: 11, color: '#16a34a', marginBottom: 16 }}>Relatorio_Zeety_{period.replaceAll(' ', '_')}.pdf</div>
              <button onClick={handleExportPdf} disabled={exportingPdf} style={{ width: '100%', padding: 11, borderRadius: 12, border: 'none', background: exportingPdf ? '#6ee7b7' : '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: exportingPdf ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                {exportingPdf ? (
                  <>
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Exportando PDF...
                  </>
                ) : (
                  <>
                    <Icon d={icons.download} size={15} stroke="#fff" /> Baixar agora
                  </>
                )}
              </button>
              {exportError && <div style={{ marginTop: 10, fontSize: 11, color: '#b91c1c' }}>{exportError}</div>}
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 14,
                border: 'none',
                background: generating ? '#94a3b8' : 'linear-gradient(135deg, #1a56db, #3b82f6)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                cursor: generating ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'inherit',
                boxShadow: generating ? 'none' : '0 4px 20px rgba(26,86,219,0.4)',
                ...enter(animate, 230),
              }}
            >
              {generating ? (
                <>
                  <div style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Gerando relatório...
                </>
              ) : (
                <>
                  <Icon d={icons.download} size={16} stroke="#fff" />
                  Exportar PDF
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function enter(ready, delay) {
  return {
    opacity: ready ? 1 : 0,
    transform: ready ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms`,
  }
}
