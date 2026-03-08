import { useEffect, useRef, useState } from 'react'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'
import { chatHistory, messages } from '../data'

export default function ScreenWhatsApp() {
  const [active, setActive] = useState(0)
  const [msg, setMsg] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active])

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: 280, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #f8fafc' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12, fontFamily: "'Sora', sans-serif" }}>Conversas</div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icon d={icons.search} size={14} /></div>
            <input placeholder="Buscar..." style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {messages.map((m, i) => (
            <div
              key={m.id}
              onClick={() => setActive(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                cursor: 'pointer',
                background: active === i ? '#eff6ff' : 'transparent',
                borderBottom: '1px solid #f8fafc',
                transition: 'background 0.1s',
                borderLeft: active === i ? '3px solid #1a56db' : '3px solid transparent',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Avatar initials={m.avatar} color={m.color} size={38} />
                {m.hot && <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{m.name}</span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{m.time}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{m.last}</div>
              </div>
              {m.unread > 0 && <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{m.unread}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={messages[active].avatar} color={messages[active].color} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{messages[active].name}</div>
            <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />IA ativa · qualificação em andamento
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '7px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>Ver perfil</button>
            <button style={{ padding: '7px 14px', borderRadius: 10, border: 'none', background: '#fef2f2', fontSize: 11, fontWeight: 700, color: '#ef4444', cursor: 'pointer' }}>Assumir conversa</button>
          </div>
        </div>

        <div style={{ margin: '12px 20px 0', padding: '8px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={icons.zap} size={13} stroke="#10b981" />
          <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Agente IA qualificando este lead automaticamente · Score atual: 87</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {chatHistory.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: c.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '68%',
                  padding: '10px 14px',
                  borderRadius: c.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: c.from === 'user' ? '#dcf8c6' : '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  border: c.from === 'bot' ? '1px solid #f1f5f9' : 'none',
                }}
              >
                {c.from === 'bot' && <div style={{ fontSize: 9, fontWeight: 700, color: '#1a56db', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🤖 Zeety IA</div>}
                <div style={{ fontSize: 12, color: '#0f172a', lineHeight: 1.5 }}>{c.text}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>{c.time}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, alignItems: 'center' }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <Icon d={icons.upload} size={15} />
          </button>
          <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Digite uma mensagem..." style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc', fontFamily: 'inherit' }} />
          <button style={{ width: 36, height: 36, borderRadius: 10, background: '#1a56db', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={icons.send} size={16} stroke="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}
