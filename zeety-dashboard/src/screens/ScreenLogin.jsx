import { useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

export default function ScreenLogin({ onLogin }) {
  const [email, setEmail] = useState('lucas@zeety.com.br')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha para continuar.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase()
      const domain = normalizedEmail.split('@')[1] || ''
      const tenantFromDomain = domain.split('.')[0] || 'zeety'
      setLoading(false)
      onLogin?.({
        tenant: tenantFromDomain,
        email: normalizedEmail,
        name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
      })
    }, 700)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at 10% 10%, #dbeafe 0%, #eff6ff 28%, #f8fafc 62%, #eef2ff 100%)', padding: 24, position: 'relative' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Sora:wght@400;600;700;800&display=swap');`}</style>
      <div style={{ width: '100%', maxWidth: 960, display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff', border: '1px solid #dbeafe', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(30,41,59,0.15)' }}>
        <div style={{ padding: '44px 38px', background: 'linear-gradient(160deg, #0f172a 0%, #111827 70%, #1e293b 100%)', color: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', top: -40, right: -50, filter: 'blur(2px)' }} />
          <div style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', background: 'rgba(16,185,129,0.14)', bottom: 40, left: -35 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1a56db, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.zap} size={16} stroke="#fff" fill="#fff" />
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, fontFamily: "'Space Grotesk', 'Sora', sans-serif" }}>Zeety</div>
            </div>

            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.15, marginBottom: 12, fontFamily: "'Space Grotesk', 'Sora', sans-serif", letterSpacing: '-0.02em' }}>
              Workspace seguro para cada cliente
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>Acesse com confiança: seus dados são protegidos com autenticação segura e criptografia ponta a ponta.</div>
          </div>

          <div style={{ border: '1px solid #334155', background: 'rgba(15,23,42,0.55)', borderRadius: 14, padding: '12px 14px', fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
            A Zeety organiza sua operação comercial para você vender mais com menos esforço e mais previsibilidade.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '50px 42px', fontFamily: "'Sora', sans-serif" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4, fontFamily: "'Space Grotesk', 'Sora', sans-serif" }}>Entrar</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 28 }}>Use seu e-mail e senha para acessar seu workspace.</div>

          <Field label="E-mail">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="voce@empresa.com" style={inputStyle} />
          </Field>

          <Field label="Senha">
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} />
          </Field>

          {error && <div style={{ marginBottom: 18, marginTop: 4, fontSize: 12, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 12px' }}>{error}</div>}

          <button type="submit" style={{ width: '100%', marginTop: 4, border: 'none', background: 'linear-gradient(135deg, #1a56db, #2563eb)', color: '#fff', borderRadius: 12, padding: '12px 14px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 10px 22px rgba(37,99,235,0.24)' }}>
            {loading ? 'Entrando...' : 'Acessar dashboard'}
          </button>

        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {children}
    </label>
  )
}

const inputStyle = { width: '100%', borderRadius: 12, border: '1px solid #e2e8f0', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff' }
