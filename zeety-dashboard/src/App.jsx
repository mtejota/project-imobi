import { useState } from 'react'
import Icon from './components/Icon'
import { icons } from './constants/icons'
import { NAV } from './constants/nav'
import { notifications } from './data'
import {
  ScreenCalendar,
  ScreenDashboard,
  ScreenDocuments,
  ScreenLeads,
  ScreenMetrics,
  ScreenPipeline,
  ScreenProperties,
  ScreenWhatsApp,
} from './screens'

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [notifOpen, setNotifOpen] = useState(false)

  const screens = {
    dashboard: <ScreenDashboard />,
    leads: <ScreenLeads />,
    pipeline: <ScreenPipeline />,
    whatsapp: <ScreenWhatsApp />,
    calendar: <ScreenCalendar />,
    properties: <ScreenProperties />,
    metrics: <ScreenMetrics />,
    documents: <ScreenDocuments />,
  }

  const current = NAV.find((n) => n.id === screen)

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
              const active = screen === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
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
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent'
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
              <button style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <Icon d={icons.settings} size={13} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', paddingLeft: 28, paddingRight: 20, flexShrink: 0, gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', flex: 1 }}>{current?.label}</span>

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
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < notifications.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8fafc'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
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

          <div style={{ flex: 1, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }} key={screen}>
            {screens[screen]}
          </div>
        </div>
      </div>
    </>
  )
}
