import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar'
import ScoreBadge from '../components/ScoreBadge'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenLeads({ leads = [], onOpenLeadProfile, onOpenNewLead }) {
  const [search, setSearch] = useState('')
  const [temperatureFilter, setTemperatureFilter] = useState('Todos')
  const [stageFilter, setStageFilter] = useState('Todos')
  const [sourceFilter, setSourceFilter] = useState('Todas')
  const [sortBy, setSortBy] = useState('score_desc')

  const sources = useMemo(() => {
    const unique = Array.from(new Set(leads.map((lead) => lead.source).filter(Boolean)))
    return ['Todas', ...unique]
  }, [leads])

  const filtered = useMemo(() => {
    const bySearch = (lead) =>
      String(lead.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(lead.region || '').toLowerCase().includes(search.toLowerCase()) ||
      String(lead.phone || '').toLowerCase().includes(search.toLowerCase())

    const byTemperature = (lead) => temperatureFilter === 'Todos' || String(lead.tag || '').toLowerCase() === temperatureFilter.toLowerCase()
    const byStage = (lead) => stageFilter === 'Todos' || mapStage(lead.stage) === stageFilter
    const bySource = (lead) => sourceFilter === 'Todas' || String(lead.source || '') === sourceFilter

    const list = leads.filter((lead) => bySearch(lead) && byTemperature(lead) && byStage(lead) && bySource(lead))

    list.sort((a, b) => {
      if (sortBy === 'score_desc') return Number(b.score || 0) - Number(a.score || 0)
      if (sortBy === 'score_asc') return Number(a.score || 0) - Number(b.score || 0)
      if (sortBy === 'name_asc') return String(a.name || '').localeCompare(String(b.name || ''))
      return parseMoney(b.budget) - parseMoney(a.budget)
    })

    return list
  }, [leads, search, temperatureFilter, stageFilter, sourceFilter, sortBy])

  const stats = useMemo(() => {
    const hot = leads.filter((lead) => Number(lead.score || 0) >= 80).length
    const warm = leads.filter((lead) => Number(lead.score || 0) >= 60 && Number(lead.score || 0) < 80).length
    const active = leads.filter((lead) => ['PROPOSAL', 'NEGOTIATION', 'CLOSING'].includes(String(lead.stage || '').toUpperCase())).length
    const totalBudget = leads.reduce((sum, lead) => sum + parseMoney(lead.budget), 0)
    return { hot, warm, active, totalBudget }
  }, [leads])

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <style>{`
        .lead-cell {
          min-width: 0;
        }
        .text-ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 1080px) {
          .leads-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .leads-filters { grid-template-columns: 1fr 1fr !important; }
          .leads-table-head, .leads-table-row {
            grid-template-columns: 1.8fr 1.1fr 1fr 1fr 0.9fr 80px !important;
          }
        }
        @media (max-width: 840px) {
          .leads-kpis { grid-template-columns: 1fr !important; }
          .leads-filters { grid-template-columns: 1fr !important; }
          .leads-table-head { display: none !important; }
          .leads-table-row {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
            padding: 14px !important;
          }
          .text-ellipsis {
            white-space: normal !important;
          }
          .leads-mobile-line {
            display: flex !important;
            justify-content: space-between;
            gap: 10px;
          }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Leads</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            {leads.length} contatos · {stats.hot} quentes · {stats.active} em negociação ativa
          </div>
        </div>
        <button onClick={onOpenNewLead} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={icons.plus} size={14} stroke="#fff" /> Novo Lead
        </button>
      </div>

      <div className="leads-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 16 }}>
        <KpiCard label="Leads Quentes" value={String(stats.hot)} delta="+12%" color="#ef4444" bg="#fef2f2" />
        <KpiCard label="Leads Mornos" value={String(stats.warm)} delta="+5%" color="#f59e0b" bg="#fffbeb" />
        <KpiCard label="Negociações Ativas" value={String(stats.active)} delta="+8%" color="#3b82f6" bg="#eff6ff" />
        <KpiCard label="Potencial em Carteira" value={formatCompactMoney(stats.totalBudget)} delta="+14%" color="#10b981" bg="#f0fdf4" />
      </div>

      <div className="leads-filters" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.8fr) repeat(4, minmax(140px, 1fr))', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <Icon d={icons.search} size={16} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone ou região..."
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f8fafc', fontFamily: 'inherit' }}
          />
        </div>
        <Select value={temperatureFilter} onChange={setTemperatureFilter} options={['Todos', 'Quente', 'Morno', 'Frio']} />
        <Select value={stageFilter} onChange={setStageFilter} options={['Todos', 'Prospecção', 'Visita', 'Proposta', 'Negociação', 'Fechamento']} />
        <Select value={sourceFilter} onChange={setSourceFilter} options={sources} />
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'score_desc', label: 'Score (maior)' },
            { value: 'score_asc', label: 'Score (menor)' },
            { value: 'budget_desc', label: 'Orçamento (maior)' },
            { value: 'name_asc', label: 'Nome (A-Z)' },
          ]}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="leads-table-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1.2fr 1fr 80px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          {['Lead', 'Contato', 'Estágio', 'Orçamento', 'Score', 'Ação'].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Nenhum lead encontrado com os filtros atuais.
          </div>
        )}

        {filtered.map((l, i) => (
          <div
            key={l.id}
            className="leads-table-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.2fr 1.2fr 1.2fr 1fr 80px',
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fafafa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            onClick={() => onOpenLeadProfile?.(l)}
          >
            <div className="lead-cell" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <Avatar initials={l.avatar} color={l.color} size={36} />
              <div style={{ minWidth: 0 }}>
                <div className="text-ellipsis" style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.name}</div>
                <div className="text-ellipsis" style={{ fontSize: 11, color: '#94a3b8' }}>{l.source} · {l.time}</div>
              </div>
            </div>
            <div className="lead-cell leads-mobile-line text-ellipsis" style={{ fontSize: 12, color: '#64748b', fontFamily: "'DM Mono', monospace" }}>{l.phone}</div>
            <div className="lead-cell leads-mobile-line" style={{ fontSize: 12, color: '#64748b', minWidth: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 999, background: `${getStageColor(mapStage(l.stage))}14`, color: getStageColor(mapStage(l.stage)), fontWeight: 700 }}>
                {mapStage(l.stage)}
              </span>
              <span className="text-ellipsis" style={{ color: '#94a3b8', fontSize: 11 }}>{l.region}</span>
            </div>
            <div className="lead-cell leads-mobile-line text-ellipsis" style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{l.budget}</div>
            <div className="lead-cell leads-mobile-line" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <ScoreBadge score={l.score} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{l.tag}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                }}
                style={{ width: 30, height: 30, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                <Icon d={icons.phone} size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenLeadProfile?.(l)
                }}
                style={{ width: 30, height: 30, borderRadius: 8, background: '#eff6ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}
              >
                <Icon d={icons.eye} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiCard({ label, value, delta, color, bg }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 800, color, background: bg, borderRadius: 999, padding: '3px 8px' }}>{delta}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{value}</div>
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, color: '#475569', background: '#fff', outline: 'none' }}
    >
      {options.map((opt) => {
        const item = typeof opt === 'string' ? { value: opt, label: opt } : opt
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        )
      })}
    </select>
  )
}

function mapStage(stage) {
  const value = String(stage || '').toUpperCase()
  if (value.includes('PROSPECT')) return 'Prospecção'
  if (value.includes('VISIT')) return 'Visita'
  if (value.includes('PROPOS')) return 'Proposta'
  if (value.includes('NEGOT')) return 'Negociação'
  if (value.includes('CLOSING') || value.includes('CLOSED')) return 'Fechamento'
  return 'Prospecção'
}

function getStageColor(stage) {
  if (stage === 'Visita') return '#3b82f6'
  if (stage === 'Proposta') return '#f59e0b'
  if (stage === 'Negociação') return '#f97316'
  if (stage === 'Fechamento') return '#10b981'
  return '#64748b'
}

function parseMoney(value) {
  if (!value) return 0
  const raw = String(value).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  const amount = Number(raw)
  return Number.isFinite(amount) ? amount : 0
}

function formatCompactMoney(value) {
  const n = Number(value || 0)
  if (n >= 1000000) return `R$ ${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `R$ ${(n / 1000).toFixed(0)}k`
  return `R$ ${n.toLocaleString('pt-BR')}`
}
