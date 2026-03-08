import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const STAGES = ['Prospecção', 'Visita', 'Proposta', 'Negociação', 'Fechamento']
const SOURCES = ['WhatsApp', 'ZAP', 'Site', 'Indicação', 'OLX']
const TAGS = ['Quente', 'Morno', 'Frio']

export default function ScreenLeadEdit({ lead, onBack, onOpenProfile }) {
  const base = useMemo(
    () =>
      lead || {
        id: 0,
        name: 'Lead não encontrado',
        phone: '',
        score: 0,
        tag: 'Frio',
        source: 'Site',
        budget: 'R$ 0',
        type: '',
        region: '',
      },
    [lead]
  )

  const [form, setForm] = useState({
    name: base.name,
    phone: base.phone,
    email: `${base.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    source: base.source,
    stage: 'Negociação',
    tag: base.tag,
    region: base.region,
    budget: base.budget,
    profile: base.type,
    notes: 'Lead com interesse ativo. Atualizar status após retorno no WhatsApp.',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const setField = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }))

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2600)
    }, 1000)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      {saved && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 120, background: '#0f172a', color: '#fff', borderRadius: 12, padding: '10px 16px', fontSize: 12, fontWeight: 700 }}>
          Alterações salvas com sucesso
        </div>
      )}

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            <Icon d={icons.back} size={15} /> Leads
          </button>
          <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Editar Lead</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', padding: 22, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Nome"><Input value={form.name} onChange={setField('name')} /></Field>
            <Field label="Telefone"><Input value={form.phone} onChange={setField('phone')} /></Field>
            <Field label="E-mail"><Input value={form.email} onChange={setField('email')} /></Field>
            <Field label="Região"><Input value={form.region} onChange={setField('region')} /></Field>
            <Field label="Origem"><Select value={form.source} options={SOURCES} onChange={setField('source')} /></Field>
            <Field label="Estágio"><Select value={form.stage} options={STAGES} onChange={setField('stage')} /></Field>
            <Field label="Temperatura"><Select value={form.tag} options={TAGS} onChange={setField('tag')} /></Field>
            <Field label="Orçamento"><Input value={form.budget} onChange={setField('budget')} /></Field>
            <Field label="Perfil de interesse"><Input value={form.profile} onChange={setField('profile')} /></Field>
          </div>

          <div style={{ marginTop: 14 }}>
            <Field label="Notas internas">
              <textarea value={form.notes} onChange={setField('notes')} style={{ width: '100%', minHeight: 100, borderRadius: 12, border: '1px solid #e2e8f0', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} />
            </Field>
          </div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 8 }}>
          <Icon d={icons.zap} size={14} stroke="#2563eb" />
          <span style={{ fontSize: 12, color: '#1d4ed8' }}>Sugestão da IA: atualizar o estágio para "Proposta" após o próximo follow-up.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onOpenProfile} style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Ver perfil do lead
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onBack} style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button onClick={handleSave} style={{ border: 'none', background: '#1a56db', color: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
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

function Input(props) {
  return <input {...props} style={{ width: '100%', borderRadius: 12, border: '1px solid #e2e8f0', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
}

function Select({ options, ...props }) {
  return (
    <select {...props} style={{ width: '100%', borderRadius: 12, border: '1px solid #e2e8f0', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
