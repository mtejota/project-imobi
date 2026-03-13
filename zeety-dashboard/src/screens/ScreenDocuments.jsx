import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenDocuments({ onOpenRequestDocuments, onOpenUpload }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('recentes')

  const docs = [
    { name: 'Proposta Comercial - Beatriz Santos.pdf', type: 'Proposta', size: '184 KB', date: '05/03', status: 'Enviado', color: '#8b5cf6' },
    { name: 'RG + CPF - João Ferreira.pdf', type: 'Documento', size: '2.1 MB', date: '06/03', status: 'Recebido', color: '#3b82f6' },
    { name: 'Contrato Compra e Venda - Morumbi.docx', type: 'Contrato', size: '512 KB', date: '04/03', status: 'Pendente Assinatura', color: '#f59e0b' },
    { name: 'Comprovante de Renda - Beatriz.pdf', type: 'Documento', size: '890 KB', date: '06/03', status: 'Recebido', color: '#10b981' },
    { name: 'Ficha Cadastral - Rafael Mendes.pdf', type: 'Ficha', size: '210 KB', date: '03/03', status: 'Pendente', color: '#ef4444' },
    { name: 'Laudo de Avaliação - Itaim.pdf', type: 'Laudo', size: '3.4 MB', date: '01/03', status: 'Aprovado', color: '#10b981' },
  ]

  const statusColor = { Enviado: '#3b82f6', Recebido: '#10b981', 'Pendente Assinatura': '#f59e0b', Pendente: '#ef4444', Aprovado: '#10b981' }
  const statusBg = { Enviado: '#eff6ff', Recebido: '#f0fdf4', 'Pendente Assinatura': '#fffbeb', Pendente: '#fef2f2', Aprovado: '#f0fdf4' }
  const types = useMemo(() => ['Todos', ...Array.from(new Set(docs.map((doc) => doc.type)))], [docs])
  const filtered = useMemo(() => {
    const bySearch = (doc) =>
      String(doc.name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(doc.type || '').toLowerCase().includes(search.toLowerCase())
    const byStatus = (doc) => statusFilter === 'Todos' || doc.status === statusFilter
    const byType = (doc) => typeFilter === 'Todos' || doc.type === typeFilter

    const list = docs.filter((doc) => bySearch(doc) && byStatus(doc) && byType(doc))
    list.sort((a, b) => {
      if (sortBy === 'nome') return String(a.name).localeCompare(String(b.name))
      if (sortBy === 'status') return String(a.status).localeCompare(String(b.status))
      return parseDateBR(b.date) - parseDateBR(a.date)
    })
    return list
  }, [docs, search, statusFilter, typeFilter, sortBy])

  const stats = useMemo(() => {
    const pending = docs.filter((doc) => String(doc.status).toLowerCase().includes('pendente')).length
    const received = docs.filter((doc) => doc.status === 'Recebido' || doc.status === 'Aprovado').length
    const totalSize = docs.reduce((sum, doc) => sum + parseSize(doc.size), 0)
    return { pending, received, total: docs.length, totalSize }
  }, [docs])

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <style>{`
        @media (max-width: 1080px) {
          .docs-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .docs-filters { grid-template-columns: 1fr 1fr !important; }
          .docs-table-head, .docs-table-row { grid-template-columns: 2fr 1fr 1fr 1fr !important; }
          .docs-hide-md { display: none !important; }
        }
        @media (max-width: 760px) {
          .docs-kpis { grid-template-columns: 1fr !important; }
          .docs-filters { grid-template-columns: 1fr !important; }
          .docs-table-head { display: none !important; }
          .docs-table-row { grid-template-columns: 1fr !important; gap: 8px; }
          .docs-mobile-line { display: flex !important; justify-content: space-between; gap: 10px; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Documentos</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Central de documentos e envios</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onOpenUpload} style={{ padding: '10px 18px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon d={icons.upload} size={14} /> Upload
          </button>
          <button onClick={onOpenRequestDocuments} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Nova Solicitação</button>
        </div>
      </div>

      <div className="docs-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 14 }}>
        <DocKpi label="Total de arquivos" value={String(stats.total)} delta="+8%" color="#3b82f6" bg="#eff6ff" />
        <DocKpi label="Recebidos/Aprovados" value={String(stats.received)} delta="+12%" color="#10b981" bg="#f0fdf4" />
        <DocKpi label="Pendentes" value={String(stats.pending)} delta="-4%" color="#ef4444" bg="#fef2f2" />
        <DocKpi label="Tamanho total" value={formatSize(stats.totalSize)} delta="+3%" color="#8b5cf6" bg="#f5f3ff" />
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon d={icons.bell} size={18} stroke="#f59e0b" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>2 documentos pendentes de Rafael Mendes</div>
          <div style={{ fontSize: 12, color: '#b45309', marginTop: 2 }}>Comprovante de residência e extratos bancários · IA enviou lembrete automático</div>
        </div>
        <button onClick={onOpenRequestDocuments} style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Ver</button>
      </div>

      <div className="docs-filters" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.8fr) 1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <Icon d={icons.search} size={16} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome do arquivo ou tipo..."
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc', fontFamily: 'inherit' }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          {['Todos', 'Enviado', 'Recebido', 'Pendente Assinatura', 'Pendente', 'Aprovado'].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="recentes">Mais recentes</option>
          <option value="nome">Nome (A-Z)</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="docs-table-head" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 90px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          {['Nome', 'Tipo', 'Tamanho', 'Data', 'Status', 'Ações'].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>

        {filtered.map((d, i) => (
          <div
            key={i}
            className="docs-table-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 90px',
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
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${d.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.file} size={16} stroke={d.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</span>
            </div>
            <span className="docs-mobile-line" style={{ fontSize: 11, color: '#64748b' }}>{d.type}</span>
            <span className="docs-mobile-line" style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>{d.size}</span>
            <span className="docs-mobile-line" style={{ fontSize: 11, color: '#94a3b8' }}>{d.date}</span>
            <span className="docs-mobile-line" style={{ fontSize: 11, fontWeight: 700, color: statusColor[d.status], background: statusBg[d.status], padding: '3px 10px', borderRadius: 20, display: 'inline-block', width: 'fit-content' }}>{d.status}</span>
            <div className="docs-mobile-line" style={{ display: 'flex', gap: 6 }}>
              <button onClick={(e) => e.stopPropagation()} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.eye} size={13} />
              </button>
              <button onClick={(e) => e.stopPropagation()} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: '#eff6ff', color: '#1a56db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.download} size={13} />
              </button>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Nenhum documento encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  )
}

function DocKpi({ label, value, delta, color, bg }) {
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

function parseSize(sizeText) {
  const text = String(sizeText || '').trim().toUpperCase()
  const number = Number(text.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
  if (text.includes('MB')) return number * 1024
  if (text.includes('KB')) return number
  return number
}

function formatSize(sizeKb) {
  const value = Number(sizeKb || 0)
  if (value >= 1024) return `${(value / 1024).toFixed(1)} MB`
  return `${Math.round(value)} KB`
}

function parseDateBR(dateText) {
  const [day, month] = String(dateText || '').split('/').map(Number)
  if (!day || !month) return 0
  const date = new Date(2026, month - 1, day).getTime()
  return Number.isFinite(date) ? date : 0
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
