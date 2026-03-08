import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenDocuments() {
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

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Documentos</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Central de documentos e envios</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ padding: '10px 18px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon d={icons.upload} size={14} /> Upload
          </button>
          <button style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Nova Solicitação</button>
        </div>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon d={icons.bell} size={18} stroke="#f59e0b" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>2 documentos pendentes de Rafael Mendes</div>
          <div style={{ fontSize: 12, color: '#b45309', marginTop: 2 }}>Comprovante de residência e extratos bancários · IA enviou lembrete automático</div>
        </div>
        <button style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Ver</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          {['Nome', 'Tipo', 'Tamanho', 'Data', 'Status'].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>

        {docs.map((d, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr',
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: i < docs.length - 1 ? '1px solid #f8fafc' : 'none',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${d.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.file} size={16} stroke={d.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{d.name}</span>
            </div>
            <span style={{ fontSize: 11, color: '#64748b' }}>{d.type}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>{d.size}</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{d.date}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: statusColor[d.status], background: statusBg[d.status], padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
