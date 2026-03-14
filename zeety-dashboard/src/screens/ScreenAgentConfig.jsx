import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const TONE_OPTIONS = ['Consultivo', 'Direto', 'Premium', 'Amigável']
const STYLE_OPTIONS = ['Formal', 'Neutro', 'Descontraído']

const BEHAVIORS = [
  'Saudar o lead com contexto do imóvel de interesse',
  'Priorizar perguntas de qualificação nas 3 primeiras mensagens',
  'Evitar respostas longas (máx. 3 linhas por mensagem)',
  'Sempre confirmar data/horário antes de agendar visita',
  'Escalar para corretor quando detectar objeção de preço',
]

export default function ScreenAgentConfig() {
  const [name, setName] = useState('Nina')
  const [role, setRole] = useState('Assistente comercial da Zeety para atendimento imobiliário')
  const [tone, setTone] = useState('Consultivo')
  const [style, setStyle] = useState('Neutro')
  const [objective, setObjective] = useState('Qualificar leads com rapidez, agendar visitas e aumentar conversão no funil.')
  const [forbiddenTopics, setForbiddenTopics] = useState('Promessas jurídicas, aconselhamento financeiro formal e envio de contratos sem aprovação.')
  const [welcomeText, setWelcomeText] = useState('Olá! Eu sou a Nina, assistente da equipe Zeety. Posso te ajudar a encontrar o imóvel ideal e já organizar sua visita.')
  const [handoffText, setHandoffText] = useState('Perfeito. Vou acionar o corretor responsável agora para seguir com você.')
  const [behaviors, setBehaviors] = useState(BEHAVIORS.map((label) => ({ label, active: true })))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 1100)

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 1100)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleBehavior = (index) => {
    setBehaviors((prev) => prev.map((item, i) => (i === index ? { ...item, active: !item.active } : item)))
  }

  const handleSave = () => {
    setSaving(true)
    setSaved(false)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2400)
    }, 800)
  }

  const activeCount = behaviors.filter((item) => item.active).length

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      {saved && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', borderRadius: 12, padding: '10px 16px', fontSize: 12, fontWeight: 700, zIndex: 120 }}>
          Configuração do agente salva com sucesso
        </div>
      )}

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Agente IA</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Persona, estilo de conversa e regras de comportamento do agente.</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', padding: '6px 10px', borderRadius: 20, border: '1px solid #bfdbfe', background: '#eff6ff' }}>{activeCount} regras ativas</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', padding: '6px 10px', borderRadius: 20, border: '1px solid #bbf7d0', background: '#f0fdf4' }}>Status: ativo</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0,1fr) 340px', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <section style={cardStyle}>
              <SectionTitle icon={icons.user} title='Identidade da Persona' />
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: 12 }}>
                <Field label='Nome do agente'>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Ex: Nina' />
                </Field>
                <Field label='Tom principal'>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} style={inputStyle}>
                    {TONE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label='Papel do agente' wide>
                  <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder='Responsabilidade do agente no atendimento' />
                </Field>
                <Field label='Estilo de escrita'>
                  <select value={style} onChange={(e) => setStyle(e.target.value)} style={inputStyle}>
                    {STYLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            <section style={cardStyle}>
              <SectionTitle icon={icons.zap} title='Objetivos e Limites' />
              <Field label='Objetivo operacional'>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} style={textareaStyle} />
              </Field>
              <Field label='Assuntos proibidos / fora de escopo'>
                <textarea value={forbiddenTopics} onChange={(e) => setForbiddenTopics(e.target.value)} style={textareaStyle} />
              </Field>
            </section>

            <section style={cardStyle}>
              <SectionTitle icon={icons.chat} title='Mensagens-chave' />
              <Field label='Mensagem de boas-vindas'>
                <textarea value={welcomeText} onChange={(e) => setWelcomeText(e.target.value)} style={textareaStyle} />
              </Field>
              <Field label='Mensagem de handoff para corretor'>
                <textarea value={handoffText} onChange={(e) => setHandoffText(e.target.value)} style={textareaStyle} />
              </Field>
            </section>

            <section style={cardStyle}>
              <SectionTitle icon={icons.settings} title='Comportamentos do Agente' />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {behaviors.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => toggleBehavior(index)}
                    style={{
                      width: '100%',
                      border: `1px solid ${item.active ? '#bfdbfe' : '#e2e8f0'}`,
                      background: item.active ? '#eff6ff' : '#fff',
                      borderRadius: 11,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ width: 18, height: 18, borderRadius: 6, border: `2px solid ${item.active ? '#1d4ed8' : '#cbd5e1'}`, background: item.active ? '#1d4ed8' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.active && <Icon d={icons.check} size={10} stroke='#fff' strokeWidth={3} />}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: item.active ? '#1d4ed8' : '#334155' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={cardStyle}>
              <SectionTitle icon={icons.eye} title='Preview do Agente' />
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', padding: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Simulação de abertura</div>
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #f1f5f9', padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', marginBottom: 4 }}>{name} • {tone}</div>
                  <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>{welcomeText}</div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <SectionTitle icon={icons.trending} title='Métricas de Qualidade' />
              {[
                ['Tempo médio de resposta', '28s', '#1d4ed8'],
                ['Taxa de qualificação', '74%', '#10b981'],
                ['Handoff para corretor', '18%', '#f59e0b'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, background: '#0f172a', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon d={icons.zap} size={14} stroke='#22c55e' />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>Recomendação IA</span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
                Para aumentar conversão, mantenha tom <strong style={{ color: '#e2e8f0' }}>Consultivo</strong> e habilite regras de confirmação de visita antes do handoff.
              </div>
            </div>

            <button onClick={handleSave} style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saving ? 'Salvando...' : 'Salvar configuração do agente'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: 9, background: '#eff6ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon d={icon} size={13} stroke='#1d4ed8' />
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{title}</span>
    </div>
  )
}

function Field({ label, children, wide = false }) {
  return (
    <label style={{ display: 'block', gridColumn: wide ? '1 / -1' : 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {children}
    </label>
  )
}

function Input(props) {
  return <input {...props} style={inputStyle} />
}

const cardStyle = {
  background: '#fff',
  border: '1px solid #f1f5f9',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
}

const inputStyle = {
  width: '100%',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  padding: '10px 12px',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  background: '#fff',
}

const textareaStyle = {
  ...inputStyle,
  minHeight: 84,
  resize: 'vertical',
  lineHeight: 1.6,
}
