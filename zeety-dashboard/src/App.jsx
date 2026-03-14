import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import Icon from './components/Icon'
import { icons } from './constants/icons'
import { NAV } from './constants/nav'
import { appointmentsApi, leadsApi, notificationsApi, pipelineApi, propertiesApi } from './api'
import { loginTenantUser, registerTenantUser } from './services/authService'
import { clearStoredSession, clearTokens, getStoredSession, setStoredSession } from './services/sessionService'
import {
  ScreenAgentConfig,
  ScreenCalendar,
  ScreenDashboard,
  ScreenDocumentUpload,
  ScreenDocuments,
  ScreenFirstSteps,
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
} from './screens'

const ALERT_TEMPLATES = [
  { icon: 'zap', color: '#ef4444', bg: '#fef2f2', title: 'Lead Quente detectado!', desc: 'Novo lead com alta intenção de compra.' },
  { icon: 'calendar', color: '#f59e0b', bg: '#fffbeb', title: 'Visita próxima', desc: 'Visita agendada para os próximos 60 minutos.' },
  { icon: 'file', color: '#3b82f6', bg: '#eff6ff', title: 'Documento recebido', desc: 'Um cliente acabou de enviar documentação.' },
  { icon: 'refresh', color: '#8b5cf6', bg: '#f5f3ff', title: 'Follow-up automático', desc: 'A IA executou um novo follow-up no WhatsApp.' },
]

const NAV_ROUTES = {
  dashboard: 'dashboard',
  leads: 'leads',
  pipeline: 'pipeline',
  calendar: 'calendar',
  properties: 'properties',
  metrics: 'metrics',
  documents: 'documents',
  'first-steps': 'first-steps',
  agent: 'agent',
  support: 'support',
}

function formatMoney(value) {
  const amount = Number(value || 0)
  if (!amount) return 'R$ 0'
  return amount >= 1000000 ? `R$ ${(amount / 1000000).toFixed(2)}M` : `R$ ${amount.toLocaleString('pt-BR')}`
}

function normalizeLead(item = {}) {
  const name = item.name || 'Lead'
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
  return {
    ...item,
    avatar: item.avatar || initials || 'LD',
    tag:
      item.tag ||
      (Number(item.score || 0) >= 80 ? 'Quente' : Number(item.score || 0) >= 60 ? 'Morno' : 'Frio'),
    budget:
      item.budget ||
      (item.budgetMax ? formatMoney(item.budgetMax) : item.budgetMin ? formatMoney(item.budgetMin) : 'R$ 0'),
    type: item.type || item.propertyType || '-',
    region: item.region || '-',
    time: item.time || 'agora',
    color: item.color || '#3b82f6',
  }
}

function normalizeProperty(item = {}) {
  return {
    ...item,
    img: item.img || (Array.isArray(item.photos) && item.photos[0]?.url) || '',
    price: item.price ? formatMoney(item.price) : item.priceText || 'R$ 0',
    area: item.area || (item.totalArea ? `${item.totalArea}m²` : '-'),
    beds: item.beds ?? item.bedrooms ?? 0,
    baths: item.baths ?? item.bathrooms ?? 0,
    status: item.status || 'Disponível',
  }
}

function normalizePipelineCard(item = {}) {
  return {
    ...item,
    name: item.name || item.leadName || 'Negociação',
    property: item.property || item.propertyTitle || '-',
    value: item.value || formatMoney(item.askingPrice || item.offerPrice || item.amount || 0),
    days: item.days ?? item.daysInStage ?? 0,
    avatar: item.avatar || String(item.name || 'N').slice(0, 2).toUpperCase(),
    color: item.color || '#3b82f6',
  }
}

function normalizeAppointment(item = {}) {
  return {
    ...item,
    time: item.time || (item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'),
    name: item.name || item.leadName || 'Compromisso',
    property: item.property || item.propertyTitle || '-',
    type: item.type || 'Visita',
    status: item.status || 'pending',
    avatar: item.avatar || String(item.name || 'C').slice(0, 2).toUpperCase(),
    color: item.color || '#3b82f6',
  }
}

function normalizeNotification(item = {}) {
  return {
    id: item.id,
    icon: item.icon || 'bell',
    color: item.color || '#3b82f6',
    bg: item.bg || '#eff6ff',
    title: item.title || 'Notificação',
    desc: item.desc || item.message || item.body || '',
    createdAt: item.createdAt || new Date().toISOString(),
  }
}

function buildInitialAlerts(seedList = []) {
  const now = Date.now()
  return seedList.map((item, index) => ({
    ...item,
    id: item.id || `seed-${index + 1}`,
    createdAt: item.createdAt || new Date(now - (index + 1) * 7 * 60 * 1000).toISOString(),
  }))
}

function formatAlertTime(createdAt, nowMs = Date.now()) {
  const diff = Math.max(0, nowMs - new Date(createdAt).getTime())
  const minute = 60 * 1000
  const hour = 60 * minute
  if (diff < minute) return 'agora'
  if (diff < hour) return `há ${Math.floor(diff / minute)} min`
  return `há ${Math.floor(diff / hour)}h`
}

function buildRealtimeAlert(leadsList = []) {
  const randomTemplate = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)]
  const fallbackLead = { name: 'Lead', budget: '-', region: '-' }
  const sourceList = leadsList.length ? leadsList : [fallbackLead]
  const randomLead = sourceList[Math.floor(Math.random() * sourceList.length)] || fallbackLead

  return {
    id: `rt-${Date.now()}`,
    icon: randomTemplate.icon,
    color: randomTemplate.color,
    bg: randomTemplate.bg,
    title: randomTemplate.title,
    desc: `${randomLead.name} · ${randomLead.budget} · ${randomLead.region}`,
    createdAt: new Date().toISOString(),
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
  if (subPath === '/first-steps') return 'Primeiros Passos'
  if (subPath === '/agent') return 'Agente IA'
  if (subPath === '/support') return 'Suporte'
  if (subPath === '/settings') return 'Configurações'
  return 'Zeety CRM'
}

function getCurrentSubtitle(pathname, tenant) {
  const prefix = `/${tenant}`
  const subPath = pathname.startsWith(prefix) ? pathname.slice(prefix.length) || '/dashboard' : pathname
  const baseDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })
  const dateLabel = baseDate.charAt(0).toUpperCase() + baseDate.slice(1)

  if (subPath === '/dashboard') return `Visão geral da sua operação · ${dateLabel}`
  if (subPath.startsWith('/leads')) return 'Gestão completa da base de leads'
  if (subPath.startsWith('/pipeline')) return 'Negociações por etapa do funil'
  if (subPath.startsWith('/calendar')) return 'Agenda de visitas e compromissos'
  if (subPath.startsWith('/properties')) return 'Catálogo de imóveis e disponibilidade'
  if (subPath.startsWith('/metrics')) return 'Indicadores e desempenho comercial'
  if (subPath.startsWith('/documents')) return 'Fluxo documental dos clientes'
  if (subPath.startsWith('/first-steps')) return 'Guia de configuração inicial da plataforma'
  if (subPath.startsWith('/agent')) return 'Configuração de persona e comportamento do agente'
  if (subPath.startsWith('/support')) return 'Atendimento e solicitações de suporte'
  if (subPath.startsWith('/settings')) return 'Preferências de conta e integrações'
  return 'Operação comercial em tempo real'
}

function LeadProfileRoute({ onBack, onOpenEdit, onSendMessage, leadsData = [] }) {
  const { leadId } = useParams()
  const leadData = leadsData.find((l) => String(l.id) === leadId)
  return <ScreenLeadProfile leadData={leadData} onBack={onBack} onOpenEdit={() => onOpenEdit(leadId)} onSendMessage={() => onSendMessage(leadId)} />
}

function PropertyDetailRoute({ onBack, onOpenEdit, onOpenScheduleVisit, propertiesData = [] }) {
  const { propertyId } = useParams()
  const property = propertiesData.find((p) => String(p.id) === propertyId)
  return <ScreenPropertyDetail property={property} onBack={onBack} onOpenEdit={() => onOpenEdit(propertyId)} onOpenScheduleVisit={onOpenScheduleVisit} />
}

function NegotiationDetailRoute({ onBack, pipelineData = {} }) {
  const { negotiationId } = useParams()
  const negotiation = useMemo(
    () =>
      Object.entries(pipelineData)
        .flatMap(([stage, cards]) => cards.map((card) => ({ ...card, stage })))
        .find((card) => String(card.id) === negotiationId),
    [negotiationId, pipelineData]
  )

  return <ScreenNegotiationDetail negotiation={negotiation} onBack={onBack} />
}

function LeadEditRoute({ onBack, onOpenProfile, leadsData = [] }) {
  const { leadId } = useParams()
  const leadData = leadsData.find((l) => String(l.id) === leadId)
  return <ScreenLeadEdit lead={leadData} onBack={onBack} onOpenProfile={() => onOpenProfile(leadId)} />
}

function PropertyEditRoute({ onBack, onOpenDetail, propertiesData = [] }) {
  const { propertyId } = useParams()
  const property = propertiesData.find((p) => String(p.id) === propertyId)
  return <ScreenPropertyEdit property={property} onBack={onBack} onOpenDetail={() => onOpenDetail(propertyId)} />
}

function TenantLayout({
  session,
  onLogout,
  onChangeSessionUser,
  leadsData = [],
  propertiesData = [],
  pipelineData = {},
  appointmentsData = [],
  notificationsData = [],
}) {
  const { tenant } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [alerts, setAlerts] = useState(() => buildInitialAlerts(notificationsData))
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 1024)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 30 * 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts((prev) => [buildRealtimeAlert(leadsData), ...prev].slice(0, 10))
    }, 15 * 1000)
    return () => clearInterval(timer)
  }, [leadsData])

  useEffect(() => {
    setAlerts(buildInitialAlerts(notificationsData))
  }, [notificationsData])

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
  const currentSubtitle = getCurrentSubtitle(location.pathname, tenant)
  const toPath = (subPath) => `/${tenant}/${subPath}`
  const navSections = [
    { label: 'Principal', items: ['dashboard', 'calendar'] },
    { label: 'CRM', items: ['leads', 'pipeline'] },
    { label: 'Imóveis', items: ['properties'] },
    { label: 'Relatórios', items: ['metrics', 'documents'] },
    { label: 'Sistema', items: ['first-steps', 'agent', 'support'] },
  ]
  const alertsView = useMemo(
    () => alerts.map((item) => ({ ...item, timeLabel: formatAlertTime(item.createdAt, nowMs) })),
    [alerts, nowMs]
  )

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f1f5f9; color: #0f172a; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 90 }}
          />
        )}

        <div
          style={{
            width: 272,
            background: '#fff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            boxShadow: '1px 0 0 0 #e2e8f0',
            position: isMobile ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: isMobile ? 100 : 'auto',
            transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-110%)') : 'none',
            transition: 'transform .25s ease',
          }}
        >
          <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                <img src="/zeety-logo.svg" alt="Zeety" style={{ width: 18, height: 18, display: 'block' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>Zeety</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#2563eb', background: '#eff6ff', borderRadius: 999, padding: '2px 6px', letterSpacing: '0.06em' }}>IA</div>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}
                >
                  <Icon d={icons.x} size={14} />
                </button>
              )}
            </div>
          </div>

          <nav style={{ flex: 1, padding: '14px 10px 6px', overflowY: 'auto' }}>
            {navSections.map((section) => (
              <div key={section.label} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#94a3b8', padding: '0 8px', marginBottom: 4 }}>
                  {section.label}
                </div>
                {section.items.map((id) => {
                  const item = NAV.find((navItem) => navItem.id === id)
                  if (!item) return null
                  const path = toPath(NAV_ROUTES[item.id])
                  const active = location.pathname === path || location.pathname.startsWith(`${path}/`)
                  const badgeLabel =
                    item.id === 'leads' && leadsData.length > 0
                        ? String(Math.min(leadsData.length, 99))
                        : ''

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(path)
                        if (isMobile) setSidebarOpen(false)
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                        padding: '8px 10px',
                        borderRadius: 8,
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
                      <Icon d={icons[item.icon]} size={16} stroke="currentColor" />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 500 }}>{item.label}</span>
                      {badgeLabel && (
                        <span style={{ minWidth: 18, height: 18, padding: '0 6px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: '#2563eb', color: '#fff' }}>
                          {badgeLabel}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>

          <div style={{ padding: '10px', borderTop: '1px solid #f1f5f9' }}>
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
          <div style={{ height: 60, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', paddingLeft: isMobile ? 12 : 24, paddingRight: isMobile ? 12 : 24, flexShrink: 0, gap: 12 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}
              >
                <Icon d={icons.more} size={16} />
              </button>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{currentLabel}</span>
              <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{currentSubtitle}</span>
            </div>

            <button onClick={onLogout} style={{ border: '1px solid #e2e8f0', background: '#fff', borderRadius: 10, padding: '7px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>
              Sair
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #f1f5f9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', position: 'relative' }}
              >
                <Icon d={icons.bell} size={17} />
                {alertsView.length > 0 && <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff' }} />}
              </button>

              {notifOpen && (
                <div style={{ position: 'absolute', top: 46, right: 0, width: 320, background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, animation: 'fadeIn 0.15s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Notificações ({alertsView.length})
                    </span>
                    <button onClick={clearAlerts} style={{ border: 'none', background: '#f8fafc', color: '#64748b', borderRadius: 8, padding: '5px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Limpar
                    </button>
                  </div>

                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {alertsView.length === 0 && <div style={{ padding: '14px 12px', fontSize: 12, color: '#94a3b8' }}>Sem notificações no momento.</div>}

                    {alertsView.map((n, i) => (
                      <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < alertsView.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon d={icons[n.icon]} size={15} stroke={n.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{n.desc}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{n.timeLabel}</div>
                        </div>
                        <button onClick={() => dismissAlert(n.id)} style={{ width: 24, height: 24, borderRadius: 8, border: 'none', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexShrink: 0 }}>
                          <Icon d={icons.x} size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
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
              <Route
                path="dashboard"
                element={
                  <ScreenDashboard
                    onOpenCalendar={() => navigate(toPath('calendar'))}
                    onOpenPipeline={() => navigate(toPath('pipeline'))}
                    onOpenMetrics={() => navigate(toPath('metrics'))}
                    userName={userName}
                    alerts={alertsView}
                    onDismissAlert={dismissAlert}
                    onClearAlerts={clearAlerts}
                    leads={leadsData}
                    appointments={appointmentsData}
                    pipelineData={pipelineData}
                  />
                }
              />

              <Route path="leads" element={<ScreenLeads leads={leadsData} onOpenLeadProfile={(lead) => navigate(toPath(`leads/${lead?.id || 1}`))} onOpenNewLead={() => navigate(toPath('leads/new'))} />} />
              <Route path="leads/new" element={<ScreenNewLead onBack={() => navigate(toPath('leads'))} onOpenLeadProfile={() => navigate(toPath('leads/1'))} />} />
              <Route path="leads/:leadId" element={<LeadProfileRoute leadsData={leadsData} onBack={() => navigate(toPath('leads'))} onOpenEdit={(leadId) => navigate(toPath(`leads/${leadId}/edit`))} onSendMessage={() => navigate(toPath('support'))} />} />
              <Route path="leads/:leadId/edit" element={<LeadEditRoute leadsData={leadsData} onBack={() => navigate(toPath('leads'))} onOpenProfile={(leadId) => navigate(toPath(`leads/${leadId}`))} />} />

              <Route path="pipeline" element={<ScreenPipeline initialPipeline={pipelineData} onOpenNegotiationDetail={(n) => navigate(toPath(`pipeline/${n.id}`))} onOpenNewNegotiation={() => navigate(toPath('pipeline/new'))} />} />
              <Route path="pipeline/new" element={<ScreenNewNegotiation leads={leadsData} properties={propertiesData} onBack={() => navigate(toPath('pipeline'))} onOpenDetail={() => navigate(toPath('pipeline/6'))} />} />
              <Route path="pipeline/:negotiationId" element={<NegotiationDetailRoute pipelineData={pipelineData} onBack={() => navigate(toPath('pipeline'))} />} />

              <Route path="calendar" element={<ScreenCalendar appointments={appointmentsData} onOpenSchedule={() => navigate(toPath('calendar/schedule'))} />} />
              <Route path="calendar/schedule" element={<ScreenScheduleVisit leads={leadsData} properties={propertiesData} onBack={() => navigate(toPath('calendar'))} />} />

              <Route path="properties" element={<ScreenProperties properties={propertiesData} onOpenNewProperty={() => navigate(toPath('properties/new'))} onOpenPropertyDetail={(p) => navigate(toPath(`properties/${p.id}`))} />} />
              <Route path="properties/new" element={<ScreenNewProperty onBack={() => navigate(toPath('properties'))} onOpenPropertyDetail={() => navigate(toPath('properties/1'))} />} />
              <Route path="properties/:propertyId" element={<PropertyDetailRoute propertiesData={propertiesData} onBack={() => navigate(toPath('properties'))} onOpenEdit={(propertyId) => navigate(toPath(`properties/${propertyId}/edit`))} onOpenScheduleVisit={() => navigate(toPath('calendar/schedule'))} />} />
              <Route path="properties/:propertyId/edit" element={<PropertyEditRoute propertiesData={propertiesData} onBack={() => navigate(toPath('properties'))} onOpenDetail={(propertyId) => navigate(toPath(`properties/${propertyId}`))} />} />

              <Route path="metrics" element={<ScreenMetrics onOpenGenerateReport={() => navigate(toPath('metrics/report'))} />} />
              <Route path="metrics/report" element={<ScreenGenerateReport onBack={() => navigate(toPath('metrics'))} />} />

              <Route path="documents" element={<ScreenDocuments onOpenRequestDocuments={() => navigate(toPath('documents/request'))} onOpenUpload={() => navigate(toPath('documents/upload'))} />} />
              <Route path="documents/request" element={<ScreenRequestDocuments onBack={() => navigate(toPath('documents'))} />} />
              <Route path="documents/upload" element={<ScreenDocumentUpload onBack={() => navigate(toPath('documents'))} />} />
              <Route path="first-steps" element={<ScreenFirstSteps />} />
              <Route path="agent" element={<ScreenAgentConfig />} />
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
  const [leadsData, setLeadsData] = useState([])
  const [propertiesData, setPropertiesData] = useState([])
  const [pipelineData, setPipelineData] = useState({})
  const [appointmentsData, setAppointmentsData] = useState([])
  const [notificationsData, setNotificationsData] = useState([])

  useEffect(() => {
    if (!session?.tenantId && !session?.tenant) return

    let mounted = true
    const load = async () => {
      try {
        const [leadsRes, propertiesRes, pipelineRes, appointmentsRes, notificationsRes] = await Promise.all([
          leadsApi.getLeads().catch(() => ({ items: [] })),
          propertiesApi.getProperties().catch(() => ({ items: [] })),
          pipelineApi.getPipelineCards().catch(() => ({ items: [] })),
          appointmentsApi.getAppointments().catch(() => ({ items: [] })),
          notificationsApi.getNotifications().catch(() => ({ items: [] })),
        ])

        if (!mounted) return

        const leadsItems = Array.isArray(leadsRes) ? leadsRes : leadsRes.items || []
        const propertiesItems = Array.isArray(propertiesRes) ? propertiesRes : propertiesRes.items || []
        const pipelineItems = Array.isArray(pipelineRes) ? pipelineRes : pipelineRes.items || []
        const appointmentsItems = Array.isArray(appointmentsRes) ? appointmentsRes : appointmentsRes.items || []
        const notificationsItems = Array.isArray(notificationsRes) ? notificationsRes : notificationsRes.items || []

        const groupedPipeline = pipelineItems.reduce((acc, card) => {
          const normalized = normalizePipelineCard(card)
          const stage = normalized.stage || 'Prospecção'
          if (!acc[stage]) acc[stage] = []
          acc[stage].push(normalized)
          return acc
        }, {})

        setLeadsData(leadsItems.map(normalizeLead))
        setPropertiesData(propertiesItems.map(normalizeProperty))
        setPipelineData(groupedPipeline)
        setAppointmentsData(appointmentsItems.map(normalizeAppointment))
        setNotificationsData(notificationsItems.map(normalizeNotification))
      } catch {
        if (!mounted) return
        setLeadsData([])
        setPropertiesData([])
        setPipelineData({})
        setAppointmentsData([])
        setNotificationsData([])
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [session?.tenant, session?.tenantId])

  const handleLogin = (nextSession) => {
    setStoredSession(nextSession)
    setSession(nextSession)
  }

  const handleLogout = () => {
    clearStoredSession()
    clearTokens()
    setSession(null)
    setLeadsData([])
    setPropertiesData([])
    setPipelineData({})
    setAppointmentsData([])
    setNotificationsData([])
  }

  const handleChangeSessionUser = (changes) => {
    setSession((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...changes }
      setStoredSession(next)
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

      <Route
        path="/:tenant/*"
        element={
          <TenantLayout
            session={session}
            onLogout={handleLogout}
            onChangeSessionUser={handleChangeSessionUser}
            leadsData={leadsData}
            propertiesData={propertiesData}
            pipelineData={pipelineData}
            appointmentsData={appointmentsData}
            notificationsData={notificationsData}
          />
        }
      />

      <Route path="*" element={<Navigate to={session ? `/${session.tenant}/dashboard` : '/login'} replace />} />
    </Routes>
  )
}
