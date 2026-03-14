import { useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const Field = ({ label, required, hint, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      {hint && <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8', marginLeft: 6 }}>{hint}</span>}
    </label>
    {children}
  </div>
)

const Input = ({ placeholder, type = 'text', value, onChange, icon, prefix }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    {icon && (
      <div style={{ position: 'absolute', left: 12, color: '#94a3b8', pointerEvents: 'none', zIndex: 1 }}>
        <Icon d={icon} size={15} />
      </div>
    )}
    {prefix && (
      <div style={{ padding: '0 12px', height: 42, background: '#f8fafc', border: '1px solid #e2e8f0', borderRight: 'none', borderRadius: '10px 0 0 10px', display: 'flex', alignItems: 'center', fontSize: 13, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
        {prefix}
      </div>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        flex: 1,
        width: '100%',
        height: 42,
        padding: `0 14px 0 ${icon ? '38px' : '14px'}`,
        borderRadius: prefix ? '0 10px 10px 0' : 10,
        border: '1px solid #e2e8f0',
        fontSize: 13,
        outline: 'none',
        background: '#fff',
        fontFamily: 'inherit',
        color: '#0f172a',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#1a56db'
        e.target.style.boxShadow = '0 0 0 3px #1a56db15'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#e2e8f0'
        e.target.style.boxShadow = 'none'
      }}
    />
  </div>
)

const Select = ({ options, value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: '100%',
      height: 42,
      padding: '0 14px',
      borderRadius: 10,
      border: '1px solid #e2e8f0',
      fontSize: 13,
      outline: 'none',
      background: '#fff',
      fontFamily: 'inherit',
      color: '#0f172a',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
)

const STEPS = ['Dados Pessoais', 'Perfil de Busca', 'Origem & Corretor', 'Revisão']

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  type: '',
  region: '',
  budget: '',
  bedrooms: '',
  purpose: '',
  source: '',
  broker: '',
  stage: 'Prospecção',
  notes: '',
  tags: [],
}

export default function ScreenNewLead({ onBack, onOpenLeadProfile }) {
  const [step, setStep] = useState(0)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const tagToggle = (t) => setForm((f) => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] }))

  const completedSteps = [form.name && form.phone, form.type && form.budget && form.region, form.source && form.broker, true]

  if (saved) {
    return (
      <div style={{ height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Icon d={icons.check} size={36} stroke="#10b981" strokeWidth={2.5} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Lead criado com sucesso!</div>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>IA já iniciou a qualificação via WhatsApp.</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => {
                setSaved(false)
                setStep(0)
                setForm(emptyForm)
              }}
              style={{ padding: '10px 24px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              + Novo Lead
            </button>
            <button
              onClick={() => onOpenLeadProfile?.()}
              style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Ver perfil →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            <Icon d={icons.back} size={15} /> Leads
          </button>
          <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Novo Lead</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: i <= step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i <= step ? '#1a56db' : '#f1f5f9', border: `2px solid ${i <= step ? '#1a56db' : '#e2e8f0'}`, fontSize: 13, fontWeight: 800, color: i <= step ? '#fff' : '#94a3b8' }}>
                  {i < step ? <Icon d={icons.check} size={16} stroke="#fff" strokeWidth={2.5} /> : i + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: i === step ? 700 : 500, color: i === step ? '#1a56db' : '#94a3b8', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#1a56db' : '#f1f5f9', margin: '0 8px', marginBottom: 24 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #f8fafc', background: 'linear-gradient(135deg, #eff6ff 0%, #fff 60%)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{STEPS[step]}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              Passo {step + 1} de {STEPS.length}
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            {step === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Nome completo" required>
                    <Input placeholder="Ex: João Silva" value={form.name} onChange={set('name')} icon={icons.user} />
                  </Field>
                </div>
                <Field label="Telefone / WhatsApp" required>
                  <Input placeholder="(11) 99999-9999" value={form.phone} onChange={set('phone')} icon={icons.phone} />
                </Field>
                <Field label="E-mail" hint="(opcional)">
                  <Input placeholder="email@exemplo.com" type="email" value={form.email} onChange={set('email')} icon={icons.mail} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Field label="Tipo de imóvel" required>
                  <Select
                    value={form.type}
                    onChange={set('type')}
                    options={[
                      { value: '', label: 'Selecionar...' },
                      { value: 'Apartamento', label: 'Apartamento' },
                      { value: 'Casa', label: 'Casa' },
                      { value: 'Cobertura', label: 'Cobertura' },
                      { value: 'Studio', label: 'Studio' },
                    ]}
                  />
                </Field>
                <Field label="Quartos">
                  <Select
                    value={form.bedrooms}
                    onChange={set('bedrooms')}
                    options={[
                      { value: '', label: 'Qualquer' },
                      { value: '1', label: '1 quarto' },
                      { value: '2', label: '2 quartos' },
                      { value: '3', label: '3 quartos' },
                      { value: '4+', label: '4+ quartos' },
                    ]}
                  />
                </Field>
                <Field label="Região / Bairro" required>
                  <Input placeholder="Ex: Pinheiros, Itaim Bibi..." value={form.region} onChange={set('region')} icon={icons.mappin} />
                </Field>
                <Field label="Orçamento máximo" required>
                  <Input placeholder="750000" type="number" prefix="R$" value={form.budget} onChange={set('budget')} />
                </Field>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Características desejadas">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {['Varanda', 'Garagem', 'Piscina', 'Academia', 'Portaria 24h', 'Pet friendly'].map((t) => (
                        <button key={t} onClick={() => tagToggle(t)} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${form.tags.includes(t) ? '#8b5cf6' : '#e2e8f0'}`, background: form.tags.includes(t) ? '#f5f3ff' : '#fff', color: form.tags.includes(t) ? '#8b5cf6' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Field label="Canal de origem" required>
                  <Select
                    value={form.source}
                    onChange={set('source')}
                    options={[
                      { value: '', label: 'Selecionar...' },
                      { value: 'WhatsApp', label: 'WhatsApp' },
                      { value: 'ZAP Imóveis', label: 'ZAP Imóveis' },
                      { value: 'Viva Real', label: 'Viva Real' },
                      { value: 'OLX', label: 'OLX' },
                      { value: 'Indicação', label: 'Indicação' },
                    ]}
                  />
                </Field>
                <Field label="Corretor responsável" required>
                  <Input placeholder="Nome do responsável" value={form.broker} onChange={set('broker')} icon={icons.user} />
                </Field>
                <Field label="Estágio inicial">
                  <Select
                    value={form.stage}
                    onChange={set('stage')}
                    options={[
                      { value: 'Prospecção', label: 'Prospecção' },
                      { value: 'Visita', label: 'Visita' },
                      { value: 'Proposta', label: 'Proposta' },
                    ]}
                  />
                </Field>
                <div />
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Anotação inicial" hint="(opcional)">
                    <textarea value={form.notes} onChange={set('notes')} placeholder="Contexto sobre o lead e preferências específicas..." style={{ width: '100%', minHeight: 100, padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical', color: '#374151', lineHeight: 1.6 }} />
                  </Field>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Nome', value: form.name || '—', icon: icons.user },
                  { label: 'Telefone', value: form.phone || '—', icon: icons.phone },
                  { label: 'E-mail', value: form.email || '—', icon: icons.mail },
                  { label: 'Tipo de imóvel', value: form.type || '—', icon: icons.building },
                  { label: 'Orçamento', value: form.budget ? `R$ ${Number(form.budget).toLocaleString('pt-BR')}` : '—', icon: icons.tag },
                  { label: 'Região', value: form.region || '—', icon: icons.mappin },
                  { label: 'Origem', value: form.source || '—', icon: icons.whatsapp },
                  { label: 'Corretor', value: form.broker || '—', icon: icons.user },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
                    <Icon d={icon} size={15} stroke="#94a3b8" />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '20px 32px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
            <button onClick={() => step > 0 && setStep(step - 1)} style={{ padding: '10px 22px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: step === 0 ? '#e2e8f0' : '#64748b', cursor: step === 0 ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              ← Voltar
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} disabled={!completedSteps[step]} style={{ padding: '10px 22px', borderRadius: 12, border: 'none', background: completedSteps[step] ? '#1a56db' : '#f1f5f9', color: completedSteps[step] ? '#fff' : '#94a3b8', fontSize: 13, fontWeight: 700, cursor: completedSteps[step] ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                Próximo →
              </button>
            ) : (
              <button onClick={() => setSaved(true)} style={{ padding: '10px 28px', borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon d={icons.check} size={14} stroke="#fff" strokeWidth={2.5} /> Salvar Lead
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
