import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import Icon from './components/Icon'
import { icons } from './constants/icons'
import { NAV } from './constants/nav'
import { leads, notifications, pipeline, properties } from './data'
import { loginTenantUser, registerTenantUser } from './services/authService'
import {
  ScreenCalendar,
  ScreenDashboard,
  ScreenDocumentUpload,
  ScreenDocuments,
  ScreenGenerateReport,
  ScreenLeadEdit,
  ScreenLeads,
  ScreenLeadProfile,
  ScreenLogin,
  ScreenMetrics,
  ScreenNewNegotiation,
  ScreenNewProperty,
  ScreenNegotiationDetail,
  ScreenNewLead,
  ScreenPipeline,
  ScreenPropertyDetail,
  ScreenPropertyEdit,
  ScreenProperties,
  ScreenRequestDocuments,
  ScreenScheduleVisit,
  ScreenSettings,
  ScreenSupport,
  ScreenWhatsApp,
} from './screens'

const NAV_ROUTES = {
  dashboard: 'dashboard',
  leads: 'leads',
  pipeline: 'pipeline',
  whatsapp: 'whatsapp',
  calendar: 'calendar',
  properties: 'properties',
  metrics: 'metrics',
  documents: 'documents',
  support: 'support',
}

function getStoredSession() {
  try {
    const raw = localStorage.getItem('zeety_session')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getCurrentLabel(pathname, tenant) {
  const prefix = `/${tenant}`
  const subPath = pathname.startsWith(prefix) ? pathname.slice(prefix.length) || '/dashboard' : pathname

  if (subPath === '/dashboard') return 'Dashboard'
  if (subPath === '/leads') return 'Leads'
  if (subPath === '/leads/new') return 'Novo Lead'
  if (/^\/leads\/[^/]+\/edit$/.test(subPath)) return 'Editar Lead'
  if (/^\/leads\/[^/]+$/.test(subPath)) return 'Perfil Lead'
  if (subPath === '/pipeline') return 'Pipeline'
  if (subPath === '/pipeline/new') return 'Nova Negociação'
  if (/^\/pipeline\/[^/]+$/.test(subPath)) return 'Detalhe da Negociação'
  if (subPath === '/whatsapp') return 'WhatsApp IA'
  if (subPath === '/calendar') return 'Agenda'
  if (subPath === '/calendar/schedule') return 'Agendar Visita'
  if (subPath === '/properties') return 'Imóveis'
  if (subPath === '/properties/new') return 'Cadastrar Imóvel'
  if (/^\/properties\/[^/]+\/edit$/.test(subPath)) return 'Editar Imóvel'
  if (/^\/properties\/[^/]+$/.test(subPath)) return 'Detalhe do Imóvel'
  if (subPath === '/metrics') return 'Métricas'
  if (subPath === '/metrics/report') return 'Gerar Relatório'
  if (subPath === '/documents') return 'Documentos'
  if (subPath === '/documents/request') return 'Solicitar Documentos'
  if (subPath === '/documents/upload') return 'Upload de Documentos'
  if (subPath === '/support') return 'Suporte'
  if (subPath === '/settings') return 'Configurações'
  return 'Zeety CRM'
}

function LeadProfileRoute({ onBack, onOpenEdit, onSendMessage }) {
  const { leadId } = useParams()
  const leadData = leads.find((l) => String(l.id) === leadId)
  return <ScreenLeadProfile leadData={leadData} onBack={onBack} onOpenEdit={() => onOpenEdit(leadId)} onSendMessage={() => onSendMessage(leadId)} />
}

function PropertyDetailRoute({ onBack, onOpenEdit, onOpenScheduleVisit }) {
  const { propertyId } = useParams()
  const property = properties.find((p) => String(p.id) === propertyId)
  return <ScreenPropertyDetail property={property} onBack={onBack} onOpenEdit={() => onOpenEdit(propertyId)} onOpenScheduleVisit={onOpenScheduleVisit} />
}

function NegotiationDetailRoute({ onBack }) {
  const { negotiationId } = useParams()
  const negotiation = useMemo(
    () =>
      Object.entries(pipeline)
        .flatMap(([stage, cards]) => cards.map((card) => ({ ...card, stage })))
        .find((card) => String(card.id) === negotiationId),
    [negotiationId]
  )

  return <ScreenNegotiationDetail negotiation={negotiation} onBack={onBack} />
}

function LeadEditRoute({ onBack, onOpenProfile }) {
  const { leadId } = useParams()
  const leadData = leads.find((l) => String(l.id) === leadId)
  return <ScreenLeadEdit lead={leadData} onBack={onBack} onOpenProfile={() => onOpenProfile(leadId)} />
}

function PropertyEditRoute({ onBack, onOpenDetail }) {
  const { propertyId } = useParams()
  const property = properties.find((p) => String(p.id) === propertyId)
  return <ScreenPropertyEdit property={property} onBack={onBack} onOpenDetail={() => onOpenDetail(propertyId)} />
}

function TenantLayout({ session, onLogout, onChangeSessionUser }) {
  const { tenant } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  if (!session) return <Navigate to="/login" replace />
  if (session.tenant !== tenant) return <Navigate to={`/${session.tenant}/dashboard`} replace />

  const userName = session.name || 'Usuário'
  const userPhoto = session.photo || ''
  const userInitials =
    userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'US'

  const currentLabel = getCurrentLabel(location.pathname, tenant)
  const toPath = (subPath) => `/${tenant}/${subPath}`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #f8fafc; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8fafc' }}>
        <div
          style={{
            width: 220,
            background: '#fff',
            borderRight: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #1a56db, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.zap} size={16} stroke="#fff" fill="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Zeety</div>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tenant}</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
            {NAV.map((item) => {
              const path = toPath(NAV_ROUTES[item.id])
              const active = location.pathname === path || location.pathname.startsWith(`${path}/`)
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(path)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? '#eff6ff' : 'transparent',
                    color: active ? '#1a56db' : '#64748b',
                    marginBottom: 2,
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background 0.15s, color 0.15s',
                    position: 'relative',
                  }}
                >
                  {active && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#1a56db', borderRadius: '0 4px 4px 0' }} />}
                  <Icon d={icons[item.icon]} size={16} stroke="currentColor" />
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div style={{ padding: '14px 14px', borderTop: '1px solid #f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {userPhoto ? (
                <img src={userPhoto} alt={userName} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1a56db40' }} />
              ) : (
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#dbeafe', border: '2px solid #1a56db40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#1a56db' }}>{userInitials}</div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{userName}</div>
                <div style={{ fontSize: 10, color: '#10b981' }}>● Online</div>
              </div>
              <button onClick={() => navigate(toPath('settings'))} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <Icon d={icons.settings} size={13} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', paddingLeft: 28, paddingRight: 20, flexShrink: 0, gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', flex: 1 }}>{currentLabel}</span>

            <button onClick={onLogout} style={{ border: '1px solid #e2e8f0', background: '#fff', borderRadius: 10, padding: '7px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>
              Sair
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #f1f5f9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', position: 'relative' }}
              >
                <Icon d={icons.bell} size={17} />
                <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff' }} />
              </button>

              {notifOpen && (
                <div style={{ position: 'absolute', top: 46, right: 0, width: 320, background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, animation: 'fadeIn 0.15s ease' }}>
                  {notifications.map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < notifications.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon d={icons[n.icon]} size={15} stroke={n.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{n.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {userPhoto ? (
              <img src={userPhoto} alt={userName} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1a56db40' }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#dbeafe', border: '2px solid #1a56db40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#1a56db' }}>{userInitials}</div>
            )}
          </div>

          <div style={{ flex: 1, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }} key={location.pathname}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ScreenDashboard onOpenLeads={() => navigate(toPath('leads'))} onOpenCalendar={() => navigate(toPath('calendar'))} />} />

              <Route path="leads" element={<ScreenLeads onOpenLeadProfile={(lead) => navigate(toPath(`leads/${lead?.id || 1}`))} onOpenNewLead={() => navigate(toPath('leads/new'))} />} />
              <Route path="leads/new" element={<ScreenNewLead onBack={() => navigate(toPath('leads'))} onOpenLeadProfile={() => navigate(toPath('leads/1'))} />} />
              <Route path="leads/:leadId" element={<LeadProfileRoute onBack={() => navigate(toPath('leads'))} onOpenEdit={(leadId) => navigate(toPath(`leads/${leadId}/edit`))} onSendMessage={() => navigate(toPath('whatsapp'))} />} />
              <Route path="leads/:leadId/edit" element={<LeadEditRoute onBack={() => navigate(toPath('leads'))} onOpenProfile={(leadId) => navigate(toPath(`leads/${leadId}`))} />} />

              <Route path="pipeline" element={<ScreenPipeline onOpenNegotiationDetail={(n) => navigate(toPath(`pipeline/${n.id}`))} onOpenNewNegotiation={() => navigate(toPath('pipeline/new'))} />} />
              <Route path="pipeline/new" element={<ScreenNewNegotiation onBack={() => navigate(toPath('pipeline'))} onOpenDetail={() => navigate(toPath('pipeline/6'))} />} />
              <Route path="pipeline/:negotiationId" element={<NegotiationDetailRoute onBack={() => navigate(toPath('pipeline'))} />} />

              <Route path="whatsapp" element={<ScreenWhatsApp onOpenLeadProfile={(lead) => navigate(toPath(`leads/${lead?.id || 1}`))} />} />

              <Route path="calendar" element={<ScreenCalendar onOpenSchedule={() => navigate(toPath('calendar/schedule'))} />} />
              <Route path="calendar/schedule" element={<ScreenScheduleVisit onBack={() => navigate(toPath('calendar'))} />} />

              <Route path="properties" element={<ScreenProperties onOpenNewProperty={() => navigate(toPath('properties/new'))} onOpenPropertyDetail={(p) => navigate(toPath(`properties/${p.id}`))} />} />
              <Route path="properties/new" element={<ScreenNewProperty onBack={() => navigate(toPath('properties'))} onOpenPropertyDetail={() => navigate(toPath('properties/1'))} />} />
              <Route path="properties/:propertyId" element={<PropertyDetailRoute onBack={() => navigate(toPath('properties'))} onOpenEdit={(propertyId) => navigate(toPath(`properties/${propertyId}/edit`))} onOpenScheduleVisit={() => navigate(toPath('calendar/schedule'))} />} />
              <Route path="properties/:propertyId/edit" element={<PropertyEditRoute onBack={() => navigate(toPath('properties'))} onOpenDetail={(propertyId) => navigate(toPath(`properties/${propertyId}`))} />} />

              <Route path="metrics" element={<ScreenMetrics onOpenGenerateReport={() => navigate(toPath('metrics/report'))} />} />
              <Route path="metrics/report" element={<ScreenGenerateReport onBack={() => navigate(toPath('metrics'))} />} />

              <Route path="documents" element={<ScreenDocuments onOpenRequestDocuments={() => navigate(toPath('documents/request'))} onOpenUpload={() => navigate(toPath('documents/upload'))} />} />
              <Route path="documents/request" element={<ScreenRequestDocuments onBack={() => navigate(toPath('documents'))} />} />
              <Route path="documents/upload" element={<ScreenDocumentUpload onBack={() => navigate(toPath('documents'))} />} />
              <Route path="support" element={<ScreenSupport />} />

              <Route
                path="settings"
                element={
                  <ScreenSettings
                    userName={userName}
                    userEmail={session.email || ''}
                    userCreci={session.creci || ''}
                    userPhoto={userPhoto}
                    onChangeUserName={(name) => onChangeSessionUser({ name })}
                    onChangeUserPhoto={(photo) => onChangeSessionUser({ photo })}
                  />
                }
              />

              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default function App() {
  const [session, setSession] = useState(() => getStoredSession())

  const handleLogin = (nextSession) => {
    localStorage.setItem('zeety_session', JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const handleLogout = () => {
    localStorage.removeItem('zeety_session')
    setSession(null)
  }

  const handleChangeSessionUser = (changes) => {
    setSession((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...changes }
      localStorage.setItem('zeety_session', JSON.stringify(next))
      return next
    })
  }

  const handleLoginWithCredentials = async ({ email, password }) => {
    const { session: nextSession } = await loginTenantUser({ email, password })
    handleLogin(nextSession)
  }

  const handleRegisterWithCredentials = async ({ name, email, password, creci }) => {
    const { session: nextSession } = await registerTenantUser({ name, email, password, creci })
    handleLogin(nextSession)
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          session ? (
            <Navigate to={`/${session.tenant}/dashboard`} replace />
          ) : (
            <ScreenLogin
              onLogin={handleLoginWithCredentials}
              onRegister={handleRegisterWithCredentials}
            />
          )
        }
      />

      <Route path="/:tenant/*" element={<TenantLayout session={session} onLogout={handleLogout} onChangeSessionUser={handleChangeSessionUser} />} />

      <Route path="*" element={<Navigate to={session ? `/${session.tenant}/dashboard` : '/login'} replace />} />
    </Routes>
  )
}
