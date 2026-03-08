import { useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const tabs = [
  { id: 'general', label: 'Geral' },
  { id: 'notifications', label: 'Notificações' },
  { id: 'integrations', label: 'Integrações' },
]

const fakeQr =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><rect width="220" height="220" fill="white"/><rect x="10" y="10" width="60" height="60" fill="black"/><rect x="20" y="20" width="40" height="40" fill="white"/><rect x="30" y="30" width="20" height="20" fill="black"/><rect x="150" y="10" width="60" height="60" fill="black"/><rect x="160" y="20" width="40" height="40" fill="white"/><rect x="170" y="30" width="20" height="20" fill="black"/><rect x="10" y="150" width="60" height="60" fill="black"/><rect x="20" y="160" width="40" height="40" fill="white"/><rect x="30" y="170" width="20" height="20" fill="black"/><rect x="90" y="90" width="10" height="10" fill="black"/><rect x="110" y="90" width="10" height="10" fill="black"/><rect x="130" y="90" width="10" height="10" fill="black"/><rect x="90" y="110" width="10" height="10" fill="black"/><rect x="110" y="110" width="10" height="10" fill="black"/><rect x="130" y="110" width="10" height="10" fill="black"/><rect x="90" y="130" width="10" height="10" fill="black"/><rect x="110" y="130" width="10" height="10" fill="black"/><rect x="130" y="130" width="10" height="10" fill="black"/></svg>'

export default function ScreenSettings({ userName = 'Lucas Correia', userEmail = 'lucas@zeety.com.br', userCreci = '', userPhoto = '', onChangeUserName, onChangeUserPhoto }) {
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [photoName, setPhotoName] = useState('Sem arquivo selecionado')
  const [showQr, setShowQr] = useState(false)
  const [pairing, setPairing] = useState(false)
  const [evolutionInstance, setEvolutionInstance] = useState('')
  const fileInputRef = useRef(null)
  const previousPhotoRef = useRef('')

  const isWhatsappConnected = Boolean(evolutionInstance)
  const userInitials =
    userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'LC'

  const summaryItems = useMemo(
    () => [
      { label: 'Usuário', value: userName, color: '#1a56db' },
      { label: 'Plano', value: 'Ultra', color: '#8b5cf6' },
      { label: 'WhatsApp', value: isWhatsappConnected ? 'Conectado' : 'Pendente', color: isWhatsappConnected ? '#10b981' : '#f59e0b' },
    ],
    [isWhatsappConnected, userName]
  )

  const save = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 800)
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (previousPhotoRef.current) URL.revokeObjectURL(previousPhotoRef.current)

    const nextUrl = URL.createObjectURL(file)
    previousPhotoRef.current = nextUrl
    onChangeUserPhoto?.(nextUrl)
    setPhotoName(file.name)
  }

  const handleQrConnect = () => {
    setPairing(true)
    setTimeout(() => {
      const newInstance = `zeety-${Date.now()}`
      setEvolutionInstance(newInstance)
      setPairing(false)
      setShowQr(false)
    }, 1800)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      {showQr && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: 420, background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Conectar WhatsApp via QR Code</div>
              <button onClick={() => setShowQr(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.x} size={14} stroke="#64748b" />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <img src={fakeQr} alt="QR Code WhatsApp" style={{ width: 220, height: 220, borderRadius: 12, border: '1px solid #e2e8f0' }} />
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '10px 12px', fontSize: 12, color: '#1d4ed8', lineHeight: 1.5, marginBottom: 12 }}>
              Após escanear, o sistema cria automaticamente uma instância na Evolution e salva o identificador da conexão.
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowQr(false)} style={{ flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancelar
              </button>
              <button onClick={handleQrConnect} style={{ flex: 1, border: 'none', background: '#1a56db', color: '#fff', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                {pairing ? 'Conectando...' : 'Simular conexão'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Configurações</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Preferências da conta, alertas e integrações</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #f1f5f9' }}>
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: tab === item.id ? 800 : 500,
                  color: tab === item.id ? '#1a56db' : '#64748b',
                  borderBottom: `2px solid ${tab === item.id ? '#1a56db' : 'transparent'}`,
                  marginBottom: -2,
                  fontFamily: 'inherit',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {summaryItems.map((item) => (
              <div key={item.label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: item.color, marginTop: 2 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 22, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {tab === 'general' && (
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 18 }}>
              <div style={{ border: '1px solid #f1f5f9', borderRadius: 14, padding: 16, background: '#f8fafc' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Perfil do usuário</div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  {userPhoto ? (
                    <img src={userPhoto} alt="Foto de perfil" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #dbeafe' }} />
                  ) : (
                    <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#dbeafe', border: '3px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#1a56db' }}>
                      {userInitials}
                    </div>
                  )}

                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{userName}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>{photoName}</div>

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  <button onClick={() => fileInputRef.current?.click()} style={{ border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon d={icons.upload} size={13} /> Alterar foto
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Nome do usuário">
                  <Input
                    value={userName}
                    onChange={(e) => {
                      const next = e.target.value
                      onChangeUserName?.(next)
                    }}
                  />
                </Field>
                <Field label="Fuso horário"><Input defaultValue="America/Sao_Paulo" /></Field>
                <Field label="E-mail do usuário">
                  <Input value={userEmail} readOnly />
                </Field>
                <Field label="CRECI">
                  <Input value={userCreci || '-'} readOnly disabled />
                </Field>
                <Field label="Telefone"><Input defaultValue="+55 (11) 99888-7766" /></Field>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, background: '#f8fafc', padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: isWhatsappConnected ? '#10b981' : '#f59e0b' }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
                      WhatsApp {isWhatsappConnected ? 'conectado' : 'pendente de conexão'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {[
                      { label: 'Conversas ativas', value: '06', color: '#1a56db' },
                      { label: 'Leads no mês', value: '47', color: '#8b5cf6' },
                      { label: 'Tempo resposta', value: '4min', color: '#10b981' },
                      { label: 'Taxa conversão', value: '6.4%', color: '#f59e0b' },
                    ].map((item) => (
                      <div key={item.label} style={{ border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', padding: '10px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: item.color, marginTop: 3 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Notificar lead quente em tempo real',
                'Alertar visita em até 1 hora',
                'Enviar resumo diário por e-mail',
                'Avisar documentos pendentes há 48h',
                'Alerta de negociação sem avanço há 3 dias',
              ].map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid #f1f5f9', borderRadius: 12, background: '#fff' }}>
                  <span style={{ fontSize: 13, color: '#334155' }}>{item}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              ))}
            </div>
          )}

          {tab === 'integrations' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <IntegrationCard
                title="WhatsApp via QR Code"
                subtitle="Conexão direta com criação de instância Evolution"
                status={isWhatsappConnected ? 'Conectado' : 'Desconectado'}
                statusColor={isWhatsappConnected ? '#10b981' : '#f59e0b'}
                actionLabel={isWhatsappConnected ? 'Reconectar' : 'Conectar por QR Code'}
                onAction={() => setShowQr(true)}
              >
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  {isWhatsappConnected ? `Instância Evolution criada: ${evolutionInstance}` : 'Escaneie o QR Code para conectar o número comercial ao CRM.'}
                </div>
              </IntegrationCard>

              <IntegrationCard
                title="WhatsApp Cloud API"
                subtitle="Canal oficial Meta"
                status="Conectado"
                statusColor="#10b981"
                actionLabel="Gerenciar token"
              >
                <div style={{ fontSize: 12, color: '#64748b' }}>Número ativo: +55 (11) 94567-1122</div>
              </IntegrationCard>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <button onClick={save} style={{ border: 'none', background: '#1a56db', color: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saving ? 'Salvando...' : 'Salvar preferências'}
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

function Input({ style, disabled, ...props }) {
  return (
    <input
      {...props}
      disabled={disabled}
      style={{
        width: '100%',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: '10px 12px',
        fontSize: 13,
        fontFamily: 'inherit',
        outline: 'none',
        background: disabled ? '#f8fafc' : '#fff',
        color: disabled ? '#64748b' : '#0f172a',
        cursor: disabled ? 'not-allowed' : 'text',
        ...style,
      }}
    />
  )
}

function IntegrationCard({ title, subtitle, status, statusColor, actionLabel, onAction, children }) {
  return (
    <div style={{ border: '1px solid #f1f5f9', borderRadius: 14, padding: 14, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
          <Icon d={icons.whatsapp} size={14} stroke="currentColor" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{title}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>{subtitle}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: statusColor }}>{status}</span>
      </div>

      <div style={{ marginBottom: 10 }}>{children}</div>

      <button onClick={onAction} style={{ width: '100%', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        {actionLabel}
      </button>
    </div>
  )
}
