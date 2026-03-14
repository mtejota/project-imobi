import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenProperties({ properties = [], onOpenPropertyDetail, onOpenNewProperty }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('price_desc')

  const stats = useMemo(() => {
    const available = properties.filter((p) => String(p.status || '').toLowerCase().includes('dispon')).length
    const reserved = properties.filter((p) => String(p.status || '').toLowerCase().includes('reserv')).length
    const avgTicket = properties.length
      ? properties.reduce((sum, p) => sum + parseMoney(p.price), 0) / properties.length
      : 0
    const inventoryValue = properties.reduce((sum, p) => sum + parseMoney(p.price), 0)
    return { available, reserved, avgTicket, inventoryValue }
  }, [properties])

  const filtered = useMemo(() => {
    const bySearch = (p) =>
      String(p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      String(p.price || '').toLowerCase().includes(search.toLowerCase())
    const byStatus = (p) => statusFilter === 'Todos' || String(p.status || '').toLowerCase() === statusFilter.toLowerCase()

    const list = properties.filter((p) => bySearch(p) && byStatus(p))
    list.sort((a, b) => {
      if (sortBy === 'price_desc') return parseMoney(b.price) - parseMoney(a.price)
      if (sortBy === 'price_asc') return parseMoney(a.price) - parseMoney(b.price)
      if (sortBy === 'area_desc') return parseArea(b.area) - parseArea(a.area)
      return String(a.title || '').localeCompare(String(b.title || ''))
    })
    return list
  }, [properties, search, statusFilter, sortBy])

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <style>{`
        @media (max-width: 1080px) {
          .properties-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .properties-grid { grid-template-columns: 1fr !important; }
          .properties-filters { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 760px) {
          .properties-kpis { grid-template-columns: 1fr !important; }
          .properties-filters { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Imóveis</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            {properties.length} imóveis em carteira · {stats.available} disponíveis
          </div>
        </div>
        <button onClick={onOpenNewProperty} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Cadastrar Imóvel</button>
      </div>

      <div className="properties-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 16 }}>
        <PropertyKpi label="Disponíveis" value={String(stats.available)} delta="+5%" color="#10b981" bg="#f0fdf4" />
        <PropertyKpi label="Reservados" value={String(stats.reserved)} delta="+2%" color="#f59e0b" bg="#fffbeb" />
        <PropertyKpi label="Ticket médio" value={formatCompactMoney(stats.avgTicket)} delta="+7%" color="#3b82f6" bg="#eff6ff" />
        <PropertyKpi label="Valor em carteira" value={formatCompactMoney(stats.inventoryValue)} delta="+11%" color="#8b5cf6" bg="#f5f3ff" />
      </div>

      <div className="properties-filters" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.8fr) 1fr 1fr', gap: 10, marginBottom: 18 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <Icon d={icons.search} size={16} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título ou preço..."
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc', fontFamily: 'inherit' }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          {['Todos', 'Disponível', 'Reservado'].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="price_desc">Preço (maior)</option>
          <option value="price_asc">Preço (menor)</option>
          <option value="area_desc">Área (maior)</option>
          <option value="title_asc">Título (A-Z)</option>
        </select>
      </div>

      <div className="properties-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #f1f5f9',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
            }}
            onClick={() => onOpenPropertyDetail?.(p)}
          >
            <div style={{ position: 'relative' }}>
              <img src={p.img} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: p.status === 'Disponível' ? '#dcfce7' : '#fef9c3', color: p.status === 'Disponível' ? '#16a34a' : '#ca8a04' }}>{p.status}</span>
              </div>
              <button style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.star} size={14} stroke="#f59e0b" />
              </button>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 10 }}>{p.title}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1a56db', fontFamily: "'DM Mono', monospace" }}>{p.price}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                {[
                  { icon: 'layers', val: p.area },
                  { icon: 'user', val: `${p.beds}Q` },
                  { icon: 'home', val: `${p.baths}B` },
                ].map(({ icon, val }) => (
                  <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
                    <Icon d={icons[icon]} size={13} stroke="#94a3b8" /> {val}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenPropertyDetail?.(p)
                  }}
                  style={{ flex: 1, padding: '8px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
                >
                  Ver detalhes
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', background: '#eff6ff', fontSize: 11, fontWeight: 700, color: '#1a56db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                  <Icon d={icons.send} size={12} /> Compartilhar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ marginTop: 18, background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, padding: '18px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          Nenhum imóvel encontrado com os filtros atuais.
        </div>
      )}
    </div>
  )
}

function PropertyKpi({ label, value, delta, color, bg }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 800, color, background: bg, borderRadius: 999, padding: '3px 8px' }}>{delta}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
    </div>
  )
}

function parseMoney(value) {
  if (!value) return 0
  const normalized = String(value).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  const amount = Number(normalized || 0)
  return Number.isFinite(amount) ? amount : 0
}

function parseArea(value) {
  const normalized = String(value || '').replace(/[^\d.-]/g, '')
  const amount = Number(normalized || 0)
  return Number.isFinite(amount) ? amount : 0
}

function formatCompactMoney(value) {
  const amount = Number(value || 0)
  if (amount >= 1000000) return `R$ ${(amount / 1000000).toFixed(2)}M`
  if (amount >= 1000) return `R$ ${(amount / 1000).toFixed(0)}k`
  return `R$ ${amount.toLocaleString('pt-BR')}`
}

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  fontSize: 12,
  fontWeight: 700,
  color: '#475569',
  background: '#fff',
  outline: 'none',
}
