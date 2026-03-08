import { useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

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
  const [format, setFormat] = useState('PDF')
  const [sections, setSections] = useState(SECTIONS)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const toggleSection = (id) => setSections((s) => s.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)))

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 1600)
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
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: '#f0fdf4', color: '#16a34a', fontWeight: 700, border: '1px solid #bbf7d0' }}>Atualizado agora</span>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { label: 'Leads captados', value: '47', delta: '+23%', color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Visitas', value: '18', delta: '+12%', color: '#8b5cf6', bg: '#f5f3ff' },
                { label: 'Fechamentos', value: '5', delta: '+8%', color: '#10b981', bg: '#f0fdf4' },
                { label: 'Volume vendido', value: 'R$ 3.75M', delta: '+15%', color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Comissão gerada', value: 'R$ 89k', delta: '+18%', color: '#ef4444', bg: '#fef2f2' },
              ].map(({ label, value, delta, color, bg }) => (
                <div key={label} style={{ flex: 1, background: bg, borderRadius: 14, padding: '16px 14px', border: `1px solid ${color}20` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10, color: '#374151', marginTop: 6, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 10, color, marginTop: 4, fontWeight: 700 }}>{delta} vs mês ant.</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Negociações por Mês — 2026</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
              {barData.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: '100%', height: Math.floor(b * 1.3), borderRadius: '5px 5px 0 0', background: i === 2 ? '#1a56db' : '#dbeafe', transition: 'height 0.5s' }} />
                  <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Funil de Conversão</div>
              {funnelData.map((f, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{f.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{f.val}</span>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${f.pct}%`, background: f.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Origem dos Leads</div>
              {sourceData.map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <span style={{ fontSize: 11, color: '#64748b' }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f8fafc', fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Ranking de Corretores</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr', padding: '10px 22px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Corretor', 'Leads', 'Fechados', 'Comissão', 'Taxa Conv.'].map((h) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </span>
              ))}
            </div>
            {brokers.map((b, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr', padding: '13px 22px', alignItems: 'center', borderBottom: i < brokers.length - 1 ? '1px solid #f8fafc' : 'none' }}>
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
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Período</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Março 2026', 'Fevereiro 2026', 'Janeiro 2026', 'Q1 2026', '2026 (acumulado)'].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `2px solid ${period === p ? '#1a56db' : '#f1f5f9'}`, background: period === p ? '#eff6ff' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: period === p ? 700 : 500, color: period === p ? '#1a56db' : '#374151', fontFamily: 'inherit' }}>
                  {p}
                  {period === p && <Icon d={icons.check} size={13} stroke="#1a56db" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Formato</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['PDF', 'XLSX', 'Email'].map((f) => (
                <button key={f} onClick={() => setFormat(f)} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: `2px solid ${format === f ? '#1a56db' : '#e2e8f0'}`, background: format === f ? '#eff6ff' : '#fff', color: format === f ? '#1a56db' : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <Icon d={f === 'PDF' ? icons.file : f === 'XLSX' ? icons.chart : icons.mail} size={16} stroke={format === f ? '#1a56db' : '#94a3b8'} />
                  {f}
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
              <div style={{ fontSize: 11, color: '#16a34a', marginBottom: 16 }}>Relatorio_Zeety_Marco2026.{format.toLowerCase()}</div>
              <button style={{ width: '100%', padding: 11, borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                <Icon d={icons.download} size={15} stroke="#fff" /> Baixar agora
              </button>
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
              }}
            >
              {generating ? (
                <>
                  <div style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Gerando relatório...
                </>
              ) : (
                <>
                  <Icon d={format === 'Email' ? icons.mail : icons.download} size={16} stroke="#fff" />
                  {format === 'Email' ? 'Enviar por E-mail' : `Exportar ${format}`}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
