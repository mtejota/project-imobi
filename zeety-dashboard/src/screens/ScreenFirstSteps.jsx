import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const INITIAL_STEPS = [
  {
    id: 'perfil',
    title: 'Complete seu perfil',
    desc: 'Defina nome, foto, CRECI e dados de contato para personalizar atendimento e relatórios.',
    eta: '2 min',
  },
  {
    id: 'integracoes',
    title: 'Conecte WhatsApp',
    desc: 'Ative o canal principal de atendimento para captar e responder leads com velocidade.',
    eta: '4 min',
  },
  {
    id: 'imoveis',
    title: 'Cadastre os primeiros imóveis',
    desc: 'Inclua preço, fotos e características para o funil e o match funcionarem corretamente.',
    eta: '8 min',
  },
  {
    id: 'leads',
    title: 'Importe ou crie seus leads',
    desc: 'Traga sua base inicial e organize por prioridade para começar a operação.',
    eta: '5 min',
  },
  {
    id: 'agenda',
    title: 'Ajuste sua agenda comercial',
    desc: 'Configure horários de atendimento e rotina de visitas para não perder oportunidades.',
    eta: '3 min',
  },
  {
    id: 'agent',
    title: 'Configure o Agente IA',
    desc: 'Defina persona, tom e comportamento para padronizar o atendimento automático.',
    eta: '4 min',
  },
]

export default function ScreenFirstSteps() {
  const navigate = useNavigate()
  const { tenant } = useParams()
  const [steps, setSteps] = useState(INITIAL_STEPS.map((item, index) => ({ ...item, done: index === 0 })))
  const [goal, setGoal] = useState('R$ 100.000')
  const [brokerCount, setBrokerCount] = useState('1')
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 1100)
  const [showConfetti, setShowConfetti] = useState(false)
  const [collapsedChecklist, setCollapsedChecklist] = useState(false)
  const completionTriggeredRef = useRef(false)

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 1100)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const progress = useMemo(() => {
    const done = steps.filter((step) => step.done).length
    const total = steps.length
    const pct = total ? Math.round((done / total) * 100) : 0
    return { done, total, pct }
  }, [steps])

  const toggle = (id) => setSteps((prev) => prev.map((step) => (step.id === id ? { ...step, done: !step.done } : step)))

  useEffect(() => {
    if (progress.pct === 100 && !completionTriggeredRef.current) {
      completionTriggeredRef.current = true
      setShowConfetti(true)
      setCollapsedChecklist(true)
      const timer = setTimeout(() => setShowConfetti(false), 1800)
      return () => clearTimeout(timer)
    }

    if (progress.pct < 100) {
      completionTriggeredRef.current = false
    }
  }, [progress.pct])

  const goTo = (path) => {
    if (!tenant) return
    navigate(`/${tenant}${path}`)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(180px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {showConfetti && (
        <div style={{ position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 140 }}>
          <div style={{ position: 'relative', width: 260, height: 180 }}>
            {Array.from({ length: 28 }).map((_, index) => {
              const colors = ['#1d4ed8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
              const left = (index * 9) % 250
              const delay = (index % 8) * 0.06
              const duration = 1 + (index % 5) * 0.12
              return (
                <span
                  key={index}
                  style={{
                    position: 'absolute',
                    left,
                    top: 0,
                    width: 7,
                    height: 11,
                    borderRadius: 2,
                    background: colors[index % colors.length],
                    animation: `confettiFall ${duration}s ease-out ${delay}s forwards`,
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Primeiros Passos</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Siga este guia rápido para configurar seu dashboard e começar a operar com segurança.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0,1fr) 340px', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <section style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: '#eff6ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={icons.check} size={13} stroke='#1d4ed8' />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Checklist de implantação</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', padding: '6px 10px', borderRadius: 20, border: '1px solid #bfdbfe', background: '#eff6ff' }}>
                  {progress.done}/{progress.total} concluídos
                </span>
              </div>

              <div style={{ height: 9, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', marginBottom: collapsedChecklist ? 0 : 14 }}>
                <div style={{ width: `${progress.pct}%`, height: '100%', background: 'linear-gradient(90deg, #1a56db, #3b82f6)', borderRadius: 8, transition: 'width 0.35s ease' }} />
              </div>

              {collapsedChecklist ? (
                <div style={{ marginTop: 10, borderRadius: 12, border: '1px solid #bbf7d0', background: '#f0fdf4', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#166534' }}>Checklist concluído com sucesso</div>
                    <div style={{ fontSize: 11, color: '#166534' }}>Implantação inicial finalizada. Você pode expandir para revisar.</div>
                  </div>
                  <button
                    onClick={() => setCollapsedChecklist(false)}
                    style={{ border: '1px solid #86efac', background: '#fff', color: '#166534', borderRadius: 9, padding: '7px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                  >
                    Expandir
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => toggle(step.id)}
                      style={{
                        width: '100%',
                        border: `1px solid ${step.done ? '#bfdbfe' : '#e2e8f0'}`,
                        background: step.done ? '#eff6ff' : '#fff',
                        borderRadius: 12,
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                      }}
                    >
                      <span style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${step.done ? '#1d4ed8' : '#cbd5e1'}`, background: step.done ? '#1d4ed8' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 }}>
                        {step.done ? <Icon d={icons.check} size={11} stroke='#fff' strokeWidth={3} /> : <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{index + 1}</span>}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: step.done ? '#1d4ed8' : '#0f172a' }}>{step.title}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>{step.eta}</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, lineHeight: 1.5 }}>{step.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: '#eff6ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={icons.settings} size={13} stroke='#1d4ed8' />
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Configuração inicial recomendada</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: 10 }}>
                <Field label='Meta mensal de comissão'>
                  <input value={goal} onChange={(e) => setGoal(e.target.value)} style={inputStyle} />
                </Field>
                <Field label='Quantidade de corretores'>
                  <input value={brokerCount} onChange={(e) => setBrokerCount(e.target.value)} style={inputStyle} />
                </Field>
              </div>

              <div style={{ marginTop: 8, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', padding: '10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Próximas ações sugeridas</div>
                <ul style={{ margin: 0, paddingLeft: 16, color: '#334155', fontSize: 12, lineHeight: 1.65 }}>
                  <li>Crie 3 negociações de teste para validar o pipeline.</li>
                  <li>Agende 1 visita de teste para validar notificações.</li>
                  <li>Gere 1 relatório PDF para validar apresentação de dados.</li>
                </ul>
              </div>
            </section>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon d={icons.zap} size={14} stroke='#1d4ed8' />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>Tempo estimado total</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#1a56db', lineHeight: 1 }}>22 min</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Para concluir a base inicial de operação.</div>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Atalhos úteis</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Ir para Configurações', '/settings'],
                  ['Configurar Agente IA', '/agent'],
                  ['Cadastrar novo imóvel', '/properties/new'],
                  ['Criar novo lead', '/leads/new'],
                  ['Agendar visita', '/calendar/schedule'],
                ].map(([label, path]) => (
                  <button
                    key={label}
                    onClick={() => goTo(path)}
                    style={{ width: '100%', border: '1px solid #e2e8f0', background: '#fff', borderRadius: 10, padding: '8px 10px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, color: '#334155' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...cardStyle, background: '#0f172a', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon d={icons.alert} size={14} stroke='#f59e0b' />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>Boas práticas</span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>
                Mantenha dados de imóveis e leads atualizados diariamente para melhorar previsões, alertas e qualidade dos relatórios.
              </div>
            </div>
          </aside>
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
}
