import { useState } from 'react'
import Avatar from '../components/Avatar'
import ScoreBadge from '../components/ScoreBadge'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenLeads({ leads = [], onOpenLeadProfile, onOpenNewLead }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')

  const filtered = leads.filter(
    (l) =>
      (filter === 'Todos' || l.tag === filter) &&
      (String(l.name || '').toLowerCase().includes(search.toLowerCase()) || String(l.region || '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Leads</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            {leads.length} contatos · {leads.filter((lead) => Number(lead.score || 0) >= 80).length} quentes hoje
          </div>
        </div>
        <button onClick={onOpenNewLead} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={icons.plus} size={14} stroke="#fff" /> Novo Lead
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <Icon d={icons.search} size={16} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, região..."
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#f8fafc', fontFamily: 'inherit' }}
          />
        </div>
        {['Todos', 'Quente', 'Morno', 'Frio'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '9px 16px',
              borderRadius: 10,
              border: '1px solid',
              borderColor: filter === f ? '#1a56db' : '#e2e8f0',
              background: filter === f ? '#eff6ff' : '#fff',
              color: filter === f ? '#1a56db' : '#64748b',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1.2fr 1fr 80px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          {['Lead', 'Contato', 'Interesse', 'Orçamento', 'Score', 'Ação'].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {h}
            </span>
          ))}
        </div>

        {filtered.map((l, i) => (
          <div
            key={l.id}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials={l.avatar} color={l.color} size={36} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{l.source} · {l.time}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'DM Mono', monospace" }}>{l.phone}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {l.type}
              <br />
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{l.region}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{l.budget}</div>
            <ScoreBadge score={l.score} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ width: 30, height: 30, borderRadius: 8, background: '#f0fdf4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Icon d={icons.whatsapp} size={14} />
              </button>
              <button style={{ width: 30, height: 30, borderRadius: 8, background: '#eff6ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <Icon d={icons.eye} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
