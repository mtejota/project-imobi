import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const STAGES = ['Prospecção', 'Visita', 'Proposta', 'Negociação']

export default function ScreenNewNegotiation({ leads = [], properties = [], onBack, onOpenDetail }) {
  const [leadId, setLeadId] = useState(String(leads[0]?.id || ''))
  const [propertyId, setPropertyId] = useState(String(properties[0]?.id || ''))
  const [stage, setStage] = useState('Prospecção')
  const [value, setValue] = useState('750000')
  const [priority, setPriority] = useState('Média')
  const [notes, setNotes] = useState('Lead demonstrou interesse alto. Agendar visita na próxima janela disponível.')
  const [creating, setCreating] = useState(false)

  const selectedLead = useMemo(() => leads.find((l) => String(l.id) === leadId), [leadId])
  const selectedProperty = useMemo(() => properties.find((p) => String(p.id) === propertyId), [propertyId])

  const handleCreate = () => {
    setCreating(true)
    setTimeout(() => {
      setCreating(false)
      onOpenDetail?.()
    }, 900)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            <Icon d={icons.back} size={15} /> Pipeline
          </button>
          <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Nova Negociação</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
          <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 22, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Lead">
                <select value={leadId} onChange={(e) => setLeadId(e.target.value)} style={selectStyle}>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Imóvel">
                <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} style={selectStyle}>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Estágio inicial">
                <select value={stage} onChange={(e) => setStage(e.target.value)} style={selectStyle}>
                  {STAGES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Prioridade">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={selectStyle}>
                  {['Alta', 'Média', 'Baixa'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Valor esperado (R$)">
                <input value={value} onChange={(e) => setValue(e.target.value)} style={inputStyle} />
              </Field>
            </div>

            <div style={{ marginTop: 14 }}>
              <Field label="Observações internas">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }} />
              </Field>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Resumo</div>
              <SummaryRow label="Lead" value={selectedLead?.name || '-'} />
              <SummaryRow label="Imóvel" value={selectedProperty?.title || '-'} />
              <SummaryRow label="Valor" value={`R$ ${Number(value || 0).toLocaleString('pt-BR')}`} />
              <SummaryRow label="Estágio" value={stage} />
              <SummaryRow label="Prioridade" value={priority} />
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: 12, fontSize: 12, color: '#166534', lineHeight: 1.5 }}>
              IA sugere follow-up em até 2h para aumentar a chance de avanço para visita.
            </div>

            <button onClick={handleCreate} style={{ border: 'none', background: '#1a56db', color: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {creating ? 'Criando...' : 'Criar negociação'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {children}
    </label>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#334155', marginBottom: 6 }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700, color: '#0f172a' }}>{value}</span>
    </div>
  )
}

const inputStyle = { width: '100%', borderRadius: 12, border: '1px solid #e2e8f0', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }
const selectStyle = { ...inputStyle, background: '#fff' }
