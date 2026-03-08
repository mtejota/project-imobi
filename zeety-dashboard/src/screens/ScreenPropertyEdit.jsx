import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const STATUS_OPTIONS = ['Disponível', 'Reservado', 'Vendido', 'Inativo']
const TYPE_OPTIONS = ['Apartamento', 'Casa', 'Cobertura', 'Studio']

export default function ScreenPropertyEdit({ property, onBack, onOpenDetail }) {
  const base = useMemo(
    () =>
      property || {
        id: 0,
        title: 'Imóvel não encontrado',
        price: 'R$ 0',
        area: '0m²',
        beds: 0,
        baths: 0,
        status: 'Inativo',
      },
    [property]
  )

  const [form, setForm] = useState({
    title: base.title,
    price: base.price,
    condo: 'R$ 1.200',
    iptu: 'R$ 320',
    area: base.area,
    beds: String(base.beds),
    baths: String(base.baths),
    parking: '1',
    type: base.title.includes('Casa') ? 'Casa' : base.title.includes('Cobertura') ? 'Cobertura' : 'Apartamento',
    status: base.status,
    address: 'Rua dos Pinheiros, 1247, São Paulo',
    description: 'Imóvel bem localizado, com excelente liquidez e boa procura para visitação.',
  })
  const [saving, setSaving] = useState(false)

  const setField = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }))

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 900)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            <Icon d={icons.back} size={15} /> Imóveis
          </button>
          <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Editar Imóvel</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
          <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', padding: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Título"><Input value={form.title} onChange={setField('title')} /></Field>
              <Field label="Tipo"><Select value={form.type} options={TYPE_OPTIONS} onChange={setField('type')} /></Field>
              <Field label="Preço"><Input value={form.price} onChange={setField('price')} /></Field>
              <Field label="Status"><Select value={form.status} options={STATUS_OPTIONS} onChange={setField('status')} /></Field>
              <Field label="Condomínio"><Input value={form.condo} onChange={setField('condo')} /></Field>
              <Field label="IPTU"><Input value={form.iptu} onChange={setField('iptu')} /></Field>
              <Field label="Área (m²)"><Input value={form.area} onChange={setField('area')} /></Field>
              <Field label="Vagas"><Input value={form.parking} onChange={setField('parking')} /></Field>
              <Field label="Quartos"><Input value={form.beds} onChange={setField('beds')} /></Field>
              <Field label="Banheiros"><Input value={form.baths} onChange={setField('baths')} /></Field>
            </div>

            <div style={{ marginTop: 14 }}>
              <Field label="Endereço"><Input value={form.address} onChange={setField('address')} /></Field>
            </div>

            <div style={{ marginTop: 14 }}>
              <Field label="Descrição">
                <textarea value={form.description} onChange={setField('description')} style={{ width: '100%', minHeight: 120, borderRadius: 12, border: '1px solid #e2e8f0', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} />
              </Field>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Mídias do Imóvel</div>
              <div style={{ height: 140, border: '2px dashed #dbeafe', borderRadius: 12, background: '#f8fbff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                <Icon d={icons.upload} size={18} stroke="#3b82f6" />
                <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>Adicionar novas fotos</span>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: 12, fontSize: 12, color: '#1d4ed8', lineHeight: 1.5 }}>
              A IA detectou que imóveis com descrição detalhada e 8+ fotos convertem até 24% mais visitas.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={onOpenDetail} style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Ver detalhe do imóvel
              </button>
              <button onClick={handleSave} style={{ border: 'none', background: '#1a56db', color: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
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
