import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import Icon from './components/Icon'
import { icons } from './constants/icons'
import { NAV } from './constants/nav'
import { leads, notifications, pipeline, properties } from './data'
import {
  ScreenCalendar,
  ScreenDashboard,
  ScreenDocuments,
  ScreenGenerateReport,
  ScreenLeads,
  ScreenLeadProfile,
  ScreenMetrics,
  ScreenNewProperty,
  ScreenNegotiationDetail,
  ScreenNewLead,
  ScreenPipeline,
  ScreenPropertyDetail,
  ScreenProperties,
  ScreenRequestDocuments,
  ScreenScheduleVisit,
  ScreenWhatsApp,
} from './screens'

const NAV_ROUTES = {
  dashboard: '/dashboard',
  leads: '/leads',
  pipeline: '/pipeline',
  whatsapp: '/whatsapp',
  calendar: '/calendar',
  properties: '/properties',
  metrics: '/metrics',
  documents: '/documents',
}

function getCurrentLabel(pathname) {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/leads') return 'Leads'
  if (pathname === '/leads/new') return 'Novo Lead'
  if (/^\/leads\/[^/]+\/edit$/.test(pathname)) return 'Editar Lead'
  if (/^\/leads\/[^/]+$/.test(pathname)) return 'Perfil Lead'
  if (pathname === '/pipeline') return 'Pipeline'
  if (pathname === '/pipeline/new') return 'Nova Negociação'
  if (/^\/pipeline\/[^/]+$/.test(pathname)) return 'Detalhe da Negociação'
  if (pathname === '/whatsapp') return 'WhatsApp IA'
  if (pathname === '/calendar') return 'Agenda'
  if (pathname === '/calendar/schedule') return 'Agendar Visita'
  if (pathname === '/properties') return 'Imóveis'
  if (pathname === '/properties/new') return 'Cadastrar Imóvel'
  if (/^\/properties\/[^/]+\/edit$/.test(pathname)) return 'Editar Imóvel'
  if (/^\/properties\/[^/]+$/.test(pathname)) return 'Detalhe do Imóvel'
  if (pathname === '/metrics') return 'Métricas'
  if (pathname === '/metrics/report') return 'Gerar Relatório'
  if (pathname === '/documents') return 'Documentos'
  if (pathname === '/documents/request') return 'Solicitar Documentos'
  if (pathname === '/documents/upload') return 'Upload de Documentos'
  if (pathname === '/settings') return 'Configurações'
  return 'Zeety CRM'
}

function PlaceholderScreen({ title, description, onBack, backLabel = 'Voltar' }) {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 24, boxShadow: '0 8px 28px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>{description}</div>
        {onBack && (
          <button
            onClick={onBack}
            style={{ border: 'none', borderRadius: 10, background: '#1a56db', color: '#fff', padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            {backLabel}
          </button>
        )}
      </div>
    </div>
  )
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

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  const currentLabel = getCurrentLabel(location.pathname)

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
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CRM Imobiliário</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
            {NAV.map((item) => {
              const path = NAV_ROUTES[item.id]
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
                  {item.id === 'whatsapp' && <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>6</div>}
                  {item.id === 'leads' && <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>3</div>}
                </button>
              )
            })}
          </nav>

          <div style={{ padding: '14px 14px', borderTop: '1px solid #f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#dbeafe', border: '2px solid #1a56db40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#1a56db' }}>LC</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Lucas Correia</div>
                <div style={{ fontSize: 10, color: '#10b981' }}>● Online</div>
              </div>
              <button onClick={() => navigate('/settings')} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <Icon d={icons.settings} size={13} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', paddingLeft: 28, paddingRight: 20, flexShrink: 0, gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', flex: 1 }}>{currentLabel}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '5px 12px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>IA Ativa · 6 conversas</span>
            </div>

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
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Notificações</span>
                    <span style={{ fontSize: 11, color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Marcar todas</span>
                  </div>

                  {notifications.map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < notifications.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon d={icons[n.icon]} size={15} stroke={n.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{n.desc}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#dbeafe', border: '2px solid #1a56db40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#1a56db' }}>LC</div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }} key={location.pathname}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ScreenDashboard onOpenLeads={() => navigate('/leads')} onOpenCalendar={() => navigate('/calendar')} />} />

              <Route path="/leads" element={<ScreenLeads onOpenLeadProfile={(lead) => navigate(`/leads/${lead?.id || 1}`)} onOpenNewLead={() => navigate('/leads/new')} />} />
              <Route path="/leads/new" element={<ScreenNewLead onBack={() => navigate('/leads')} onOpenLeadProfile={() => navigate('/leads/1')} />} />
              <Route path="/leads/:leadId" element={<LeadProfileRoute onBack={() => navigate('/leads')} onOpenEdit={(leadId) => navigate(`/leads/${leadId}/edit`)} onSendMessage={() => navigate('/whatsapp')} />} />
              <Route path="/leads/:leadId/edit" element={<PlaceholderScreen title="Editar Lead" description="Tela de edição ainda não implementada. A rota já está pronta para integrar o formulário." onBack={() => navigate('/leads')} backLabel="Voltar para Leads" />} />

              <Route path="/pipeline" element={<ScreenPipeline onOpenNegotiationDetail={(n) => navigate(`/pipeline/${n.id}`)} onOpenNewNegotiation={() => navigate('/pipeline/new')} />} />
              <Route path="/pipeline/new" element={<PlaceholderScreen title="Nova Negociação" description="Fluxo de criação de negociação pendente. A rota já existe e pode receber o formulário." onBack={() => navigate('/pipeline')} backLabel="Voltar para Pipeline" />} />
              <Route path="/pipeline/:negotiationId" element={<NegotiationDetailRoute onBack={() => navigate('/pipeline')} />} />

              <Route path="/whatsapp" element={<ScreenWhatsApp onOpenLeadProfile={(lead) => navigate(`/leads/${lead?.id || 1}`)} />} />

              <Route path="/calendar" element={<ScreenCalendar onOpenSchedule={() => navigate('/calendar/schedule')} />} />
              <Route path="/calendar/schedule" element={<ScreenScheduleVisit onBack={() => navigate('/calendar')} />} />

              <Route path="/properties" element={<ScreenProperties onOpenNewProperty={() => navigate('/properties/new')} onOpenPropertyDetail={(p) => navigate(`/properties/${p.id}`)} />} />
              <Route path="/properties/new" element={<ScreenNewProperty onBack={() => navigate('/properties')} onOpenPropertyDetail={() => navigate('/properties/1')} />} />
              <Route path="/properties/:propertyId" element={<PropertyDetailRoute onBack={() => navigate('/properties')} onOpenEdit={(propertyId) => navigate(`/properties/${propertyId}/edit`)} onOpenScheduleVisit={() => navigate('/calendar/schedule')} />} />
              <Route path="/properties/:propertyId/edit" element={<PlaceholderScreen title="Editar Imóvel" description="Tela de edição de imóvel pendente. A rota dinâmica já está ativa." onBack={() => navigate('/properties')} backLabel="Voltar para Imóveis" />} />

              <Route path="/metrics" element={<ScreenMetrics onOpenGenerateReport={() => navigate('/metrics/report')} />} />
              <Route path="/metrics/report" element={<ScreenGenerateReport onBack={() => navigate('/metrics')} />} />

              <Route path="/documents" element={<ScreenDocuments onOpenRequestDocuments={() => navigate('/documents/request')} onOpenUpload={() => navigate('/documents/upload')} />} />
              <Route path="/documents/request" element={<ScreenRequestDocuments onBack={() => navigate('/documents')} />} />
              <Route path="/documents/upload" element={<PlaceholderScreen title="Upload de Documentos" description="Fluxo de upload individual/em lote ainda não foi implementado." onBack={() => navigate('/documents')} backLabel="Voltar para Documentos" />} />

              <Route path="/settings" element={<PlaceholderScreen title="Configurações" description="Página de preferências e integrações ainda não implementada." />} />

              <Route path="*" element={<PlaceholderScreen title="Página não encontrada" description="A rota acessada não existe no Zeety Dashboard." onBack={() => navigate('/dashboard')} backLabel="Ir para Dashboard" />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}
