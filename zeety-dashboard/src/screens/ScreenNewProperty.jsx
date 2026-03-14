import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const STEPS = ['Endereço', 'Dados do imóvel', 'Fotos', 'Valores', 'Publicar']
const FEATURES_LIST = ['Varanda gourmet', 'Sacada', 'Academia', 'Piscina', 'Portaria 24h', 'Pet friendly', 'Salão de festas', 'Playground', 'Churrasqueira', 'Jardim', 'Depósito', 'Elevador']
const PHOTO_URLS = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&q=80',
]

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ placeholder, type = 'text', prefix, value, onChange }) {
  return (
    <div style={{ display: 'flex' }}>
      {prefix && (
        <span style={{ padding: '0 12px', height: 42, background: '#f8fafc', border: '1px solid #e2e8f0', borderRight: 'none', borderRadius: '10px 0 0 10px', display: 'flex', alignItems: 'center', fontSize: 13, color: '#64748b', fontWeight: 600 }}>
          {prefix}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ flex: 1, height: 42, padding: '0 14px', borderRadius: prefix ? '0 10px 10px 0' : 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#fff', fontFamily: 'inherit', color: '#0f172a' }}
      />
    </div>
  )
}

function Select({ options, value, onChange }) {
  return (
    <select value={value} onChange={onChange} style={{ width: '100%', height: 42, padding: '0 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#fff', fontFamily: 'inherit', color: '#0f172a', cursor: 'pointer' }}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

export default function ScreenNewProperty({ onBack, onOpenPropertyDetail }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 960)
  const [features, setFeatures] = useState([])
  const [photos, setPhotos] = useState(PHOTO_URLS)
  const [portals, setPortals] = useState({ zap: true, viva: true, olx: false, site: true })
  const [form, setForm] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    cep: '',
    type: 'Apartamento',
    purpose: 'Residencial',
    area: '',
    privateArea: '',
    beds: '2',
    baths: '2',
    parking: '1',
    floor: '',
    sun: 'Manhã',
    furnishing: 'Sem mobília',
    price: '',
    condo: '',
    iptu: '',
    title: '',
    description: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggleFeature = (f) => setFeatures((fs) => (fs.includes(f) ? fs.filter((x) => x !== f) : [...fs, f]))

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 960)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: 380, padding: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Imóvel cadastrado!</div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 12 }}>IA já iniciou o match automático com leads compatíveis.</div>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8 }}>
            <Icon d={icons.zap} size={14} stroke="#10b981" />
            <span style={{ fontSize: 12, color: '#16a34a' }}>3 leads encontrados</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setDone(false); setStep(0) }} style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>
              + Cadastrar outro
            </button>
            <button onClick={onOpenPropertyDetail} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Ver imóvel →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            <Icon d={icons.back} size={15} /> Imóveis
          </button>
          <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Cadastrar Imóvel</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i <= step ? '#1a56db' : '#f1f5f9', border: `2px solid ${i <= step ? '#1a56db' : '#e2e8f0'}`, fontSize: 12, fontWeight: 800, color: i <= step ? '#fff' : '#94a3b8' }}>
                  {i < step ? <Icon d={icons.check} size={15} stroke="#fff" strokeWidth={2.5} /> : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: i === step ? 700 : 400, color: i === step ? '#1a56db' : '#94a3b8', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#1a56db' : '#f1f5f9', margin: '0 8px', marginBottom: 22 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: isCompact ? '20px 18px' : '24px 32px', borderBottom: '1px solid #f8fafc', background: 'linear-gradient(135deg, #eff6ff 0%, #fff 60%)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{STEPS[step]}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Passo {step + 1} de {STEPS.length}</div>
          </div>

          <div style={{ padding: isCompact ? 18 : 32 }}>
            {step === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: '0 24px' }}>
                <div style={{ gridColumn: '1/-1' }}><Field label="CEP" required><Input placeholder="00000-000" value={form.cep} onChange={set('cep')} /></Field></div>
                <div style={{ gridColumn: '1/-1' }}><Field label="Logradouro" required><Input placeholder="Rua, Avenida..." value={form.street} onChange={set('street')} /></Field></div>
                <Field label="Número" required><Input placeholder="1247" value={form.number} onChange={set('number')} /></Field>
                <Field label="Complemento"><Input placeholder="Apto, bloco..." value={form.complement} onChange={set('complement')} /></Field>
                <Field label="Bairro" required><Input placeholder="Pinheiros" value={form.neighborhood} onChange={set('neighborhood')} /></Field>
                <Field label="Cidade" required><Input placeholder="São Paulo" value={form.city} onChange={set('city')} /></Field>
                <Field label="Estado"><Select options={['SP', 'RJ', 'MG', 'RS']} value={form.state} onChange={set('state')} /></Field>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: '0 24px' }}>
                <Field label="Tipo" required><Select options={['Apartamento', 'Casa', 'Cobertura', 'Studio']} value={form.type} onChange={set('type')} /></Field>
                <Field label="Finalidade"><Select options={['Residencial', 'Comercial']} value={form.purpose} onChange={set('purpose')} /></Field>
                <Field label="Área total (m²)" required><Input placeholder="78" type="number" value={form.area} onChange={set('area')} /></Field>
                <Field label="Área privativa (m²)"><Input placeholder="65" type="number" value={form.privateArea} onChange={set('privateArea')} /></Field>
                <Field label="Quartos"><Select options={['Studio', '1', '2', '3', '4+']} value={form.beds} onChange={set('beds')} /></Field>
                <Field label="Banheiros"><Select options={['1', '2', '3', '4+']} value={form.baths} onChange={set('baths')} /></Field>
                <Field label="Vagas"><Select options={['0', '1', '2', '3+']} value={form.parking} onChange={set('parking')} /></Field>
                <Field label="Andar"><Input placeholder="8" type="number" value={form.floor} onChange={set('floor')} /></Field>
                <Field label="Insolação"><Select options={['Manhã', 'Tarde', 'Integral']} value={form.sun} onChange={set('sun')} /></Field>
                <Field label="Mobília"><Select options={['Sem mobília', 'Semi-mobiliado', 'Mobiliado']} value={form.furnishing} onChange={set('furnishing')} /></Field>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Características / Lazer">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {FEATURES_LIST.map((f) => (
                        <button key={f} onClick={() => toggleFeature(f)} style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${features.includes(f) ? '#1a56db' : '#e2e8f0'}`, background: features.includes(f) ? '#eff6ff' : '#fff', color: features.includes(f) ? '#1a56db' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ border: '2px dashed #e2e8f0', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 24, background: '#fafafa' }}>
                  <Icon d={icons.upload} size={32} stroke="#94a3b8" />
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginTop: 12 }}>Upload de fotos</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
                      <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon d={icons.x} size={12} stroke="#fff" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: '0 24px' }}>
                <div style={{ gridColumn: '1/-1' }}><Field label="Preço de venda" required><Input placeholder="750000" type="number" prefix="R$" value={form.price} onChange={set('price')} /></Field></div>
                <Field label="Condomínio / mês"><Input placeholder="1200" type="number" prefix="R$" value={form.condo} onChange={set('condo')} /></Field>
                <Field label="IPTU / ano"><Input placeholder="3200" type="number" prefix="R$" value={form.iptu} onChange={set('iptu')} /></Field>
                <div style={{ gridColumn: '1/-1' }}><Field label="Título do anúncio" required><Input placeholder="Lindo apartamento..." value={form.title} onChange={set('title')} /></Field></div>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Descrição completa">
                    <textarea value={form.description} onChange={set('description')} style={{ width: '100%', minHeight: 120, padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, color: '#374151' }} />
                  </Field>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Publicar nos portais</div>
                  {[
                    { key: 'zap', label: 'ZAP Imóveis' },
                    { key: 'viva', label: 'Viva Real' },
                    { key: 'olx', label: 'OLX' },
                    { key: 'site', label: 'Site próprio' },
                  ].map((p) => (
                    <div key={p.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{p.label}</div>
                      <button onClick={() => setPortals((pt) => ({ ...pt, [p.key]: !pt[p.key] }))} style={{ width: 44, height: 24, borderRadius: 12, background: portals[p.key] ? '#1a56db' : '#e2e8f0', border: 'none', cursor: 'pointer', position: 'relative' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: portals[p.key] ? 23 : 3, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10 }}>
                  <Icon d={icons.zap} size={15} stroke="#10b981" />
                  <span style={{ fontSize: 12, color: '#16a34a', lineHeight: 1.6 }}>A IA vai realizar o match automático com leads no CRM.</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: isCompact ? '14px 18px' : '20px 32px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', gap: 10 }}>
            <button onClick={() => step > 0 && setStep(step - 1)} style={{ padding: '10px 22px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: step === 0 ? '#e2e8f0' : '#64748b', cursor: step === 0 ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              ← Voltar
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 3, background: i <= step ? '#1a56db' : '#e2e8f0' }} />
              ))}
            </div>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} style={{ padding: '10px 22px', borderRadius: 12, border: 'none', background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Próximo →
              </button>
            ) : (
              <button onClick={() => setDone(true)} style={{ padding: '10px 28px', borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                <Icon d={icons.check} size={14} stroke="#fff" strokeWidth={2.5} /> Publicar Imóvel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
