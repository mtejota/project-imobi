import { useMemo, useState } from 'react'

const METRICS = [
  {
    title: 'Comissão Estimada',
    value: 'R$ 164.850',
    change: '+26,2%',
    note: 'vs mês passado',
    points: '18,32 28,26 42,38 56,48 70,58 84,64 98,70',
  },
  {
    title: 'Negociações Ativas',
    value: 'R$ 3.245.847',
    change: '+12,5%',
    note: 'este mês',
    points: '16,58 28,60 40,54 52,46 64,42 76,34 98,28',
  },
]

const CATEGORIES = [
  { label: 'Residencial', value: '48%', progress: '48%', previous: '42%' },
  { label: 'Alto padrão', value: '26%', progress: '26%', previous: '21%' },
  { label: 'Investidor', value: '16%', progress: '16%', previous: '19%' },
  { label: 'Locação', value: '10%', progress: '10%', previous: '18%' },
]



export default function ScreenLogin({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [creci, setCreci] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isLogin = mode === 'login'

  const submitLabel = useMemo(() => {
    if (loading) return isLogin ? 'Entrando...' : 'Criando conta...'
    return isLogin ? 'Entrar' : 'Cadastrar e entrar'
  }, [isLogin, loading])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (isLogin && (!email.trim() || !password.trim())) {
      setError('Preencha e-mail e senha para continuar.')
      return
    }

    if (!isLogin) {
      if (!name.trim() || !email.trim() || !password.trim() || !creci.trim()) {
        setError('Preencha nome, e-mail, senha e CRECI para cadastrar.')
        return
      }

      if (password !== confirmPassword) {
        setError('As senhas não conferem.')
        return
      }
    }

    try {
      setLoading(true)
      if (isLogin) {
        await onLogin?.({ email, password })
      } else {
        await onRegister?.({ name, email, password, creci })
      }
    } catch (err) {
      setError(err?.message || 'Não foi possível autenticar no momento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 10 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .login-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        @media (max-width: 1220px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-left { border-right: none !important; border-bottom: 1px solid #e2e8f0; }
        }
        @media (max-width: 720px) {
          .login-shell { border-radius: 18px !important; }
          .login-left, .login-right { padding: 20px !important; }
          .login-title { font-size: 32px !important; line-height: 1.08 !important; }
          .login-subtitle { font-size: 16px !important; line-height: 1.55 !important; }
          .login-metric-value { font-size: 28px !important; }
          .login-input, .login-submit { height: 52px !important; font-size: 16px !important; }
        }
      `}</style>

      <div className="login-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-shell" style={{ width: '100%', maxWidth: 1320, overflow: 'hidden', borderRadius: 24, border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 24px 70px rgba(2,6,23,0.12)' }}>
          <div className="login-grid" style={{ display: 'grid', minHeight: 'calc(100vh - 20px)', gridTemplateColumns: '500px 1fr' }}>
            <section className="login-left" style={{ padding: '24px 28px', borderRight: '1px solid #e2e8f0', background: 'linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 430 }}>
                <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 86, height: 86, borderRadius: 22, background: 'linear-gradient(180deg, #22d3ee, #2563eb)', boxShadow: '0 8px 24px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/zeety-logo.svg" alt="Zeety" style={{ width: 56, height: 56, display: 'block' }} />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h1 className="login-title" style={{ margin: 0, fontSize: 44, lineHeight: 1.06, letterSpacing: '-0.02em', color: '#0f172a', fontWeight: 600 }}>
                    Entrar no dashboard
                  </h1>
                  <p className="login-subtitle" style={{ margin: '14px auto 0', maxWidth: 360, fontSize: 17, lineHeight: 1.55, color: '#64748b' }}>
                    Digite seu e-mail e senha para continuar e acompanhar sua operacao comercial com IA.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {!isLogin && (
                    <>
                      <Field label="Nome completo">
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Seu nome" className="login-input" style={inputStyle} />
                      </Field>

                      <Field label="CRECI">
                        <input value={creci} onChange={(e) => setCreci(e.target.value)} type="text" placeholder="12345f" className="login-input" style={inputStyle} />
                      </Field>
                    </>
                  )}

                  <Field label="Endereco de e-mail">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="seu@email.com" className="login-input" style={inputStyle} />
                  </Field>

                  <Field label="Senha">
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="login-input" style={inputStyle} />
                  </Field>

                  {!isLogin && (
                    <Field label="Confirmar senha">
                      <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="login-input" style={inputStyle} />
                    </Field>
                  )}

                  {error && (
                    <div style={{ borderRadius: 12, border: '1px solid #fecaca', background: '#fef2f2', color: '#b91c1c', fontSize: 13, fontWeight: 600, padding: '10px 12px' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="login-submit" style={{ marginTop: 2, width: '100%', height: 56, borderRadius: 14, border: 'none', background: '#1790ff', color: '#fff', fontSize: 21, fontWeight: 600, cursor: loading ? 'default' : 'pointer', boxShadow: '0 12px 24px rgba(23,144,255,0.24)' }}>
                    {submitLabel}
                  </button>
                </form>

                <div style={{ marginTop: 14, textAlign: 'center', fontSize: 15, color: '#64748b' }}>
                  {isLogin ? (
                    <>
                      Nao tem uma conta?{' '}
                      <button type="button" onClick={() => setMode('register')} style={switchLinkStyle}>
                        Criar conta
                      </button>
                    </>
                  ) : (
                    <>
                      Ja tem uma conta?{' '}
                      <button type="button" onClick={() => setMode('login')} style={switchLinkStyle}>
                        Entrar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="login-right" style={{ position: 'relative', overflow: 'hidden', padding: '20px 30px', background: 'radial-gradient(circle at top center, rgba(59,130,246,0.16), transparent 32%), linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%)' }}>
              <div style={{ margin: '0 auto', maxWidth: 980, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <p style={{ margin: '0 0 12px', textAlign: 'center', fontSize: 20, color: '#475569' }}>
                  Visualize suas metricas e oportunidades em um so lugar.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {METRICS.map((card, idx) => (
                    <div key={card.title} style={{ borderRadius: 18, border: '1px solid #dbe6f5', background: '#ffffff', padding: '14px 14px 12px', boxShadow: '0 12px 24px rgba(30,41,59,0.08)' }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b' }}>{card.title}</p>

                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '6px 10px' }}>
                        <h3 className="login-metric-value" style={{ margin: 0, fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em', color: '#0f172a', fontWeight: 500 }}>{card.value}</h3>
                        <span style={{ fontSize: 18, color: '#16a34a', fontWeight: 500 }}>acima</span>
                      </div>

                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
                        <span style={{ borderRadius: 999, padding: '5px 12px', background: 'rgba(34,197,94,0.14)', color: '#16a34a', fontSize: 14, fontWeight: 700 }}>{card.change}</span>
                        <span>{card.note}</span>
                      </div>

                      <div style={{ marginTop: 10, height: 96, borderRadius: 14, border: '1px solid #edf2f7', background: 'linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0))', padding: 8 }}>
                        <svg viewBox="0 0 100 72" style={{ width: '100%', height: '100%' }}>
                          {[14, 28, 42, 56].map((y) => (
                            <line key={`${idx}-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(15,23,42,0.12)" strokeWidth="0.6" />
                          ))}
                          <defs>
                            <linearGradient id={`metric-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgba(34,197,94,0.28)" />
                              <stop offset="100%" stopColor="rgba(34,197,94,0.02)" />
                            </linearGradient>
                          </defs>
                          <path d={`M ${card.points} L 98 72 L 18 72 Z`} fill={`url(#metric-gradient-${idx})`} />
                          <polyline fill="none" stroke="#22c55e" strokeWidth="1.6" points={card.points} />
                          <circle cx="98" cy={card.points.split(' ').slice(-1)[0].split(',')[1]} r="2.2" fill="#22c55e" stroke="#fff" strokeWidth="1.1" />
                        </svg>
                      </div>
                    </div>
                  ))}

                  <div style={{ borderRadius: 18, border: '1px solid #dbe6f5', background: '#ffffff', padding: 14, boxShadow: '0 12px 24px rgba(30,41,59,0.08)' }}>
                    <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b' }}>Principais categorias</p>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>Atual vs mes anterior</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {CATEGORIES.map((item) => (
                        <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1.2fr 0.8fr', alignItems: 'center', gap: 10, fontSize: 14 }}>
                          <div>
                            <span style={{ borderRadius: 12, border: '1px solid rgba(37,99,235,0.32)', background: 'rgba(37,99,235,0.08)', color: '#2563eb', padding: '6px 10px', display: 'inline-block' }}>{item.label}</span>
                          </div>
                          <div style={{ color: '#0f172a', fontWeight: 600 }}>{item.value}</div>
                          <div style={{ height: 9, overflow: 'hidden', borderRadius: 999, background: '#e2e8f0' }}>
                            <div style={{ height: '100%', width: item.progress, borderRadius: 999, background: '#22c55e' }} />
                          </div>
                          <div style={{ textAlign: 'right', color: '#64748b' }}>{item.previous}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700, color: 'rgba(15,23,42,0.72)' }}>{label}</div>
      {children}
    </label>
  )
}

const inputStyle = {
  width: '100%',
  height: 56,
  borderRadius: 14,
  border: '1px solid #dbe3ee',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: 18,
  padding: '0 18px',
  outline: 'none',
}

const switchLinkStyle = {
  border: 'none',
  background: 'transparent',
  color: '#1790ff',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 15,
  padding: 0,
}
