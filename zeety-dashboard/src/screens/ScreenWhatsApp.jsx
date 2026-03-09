import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'
const defaultChatHistory = []
const defaultMessages = []

const defaultConversations = {}

export default function ScreenWhatsApp({ conversations = [], onOpenLeadProfile }) {
  const [active, setActive] = useState(0)
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState('all')
  const [conversationMap, setConversationMap] = useState(defaultConversations)
  const endRef = useRef(null)
  const messages = Array.isArray(conversations) ? conversations : defaultMessages

  useEffect(() => {
    const nextMap = Object.fromEntries(
      (messages || []).map((item) => [item.id, Array.isArray(item.messages) ? item.messages : defaultChatHistory])
    )
    setConversationMap(nextMap)
  }, [messages])

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const bySearch =
        String(m.name || '').toLowerCase().includes(search.toLowerCase()) ||
        String(m.last || '').toLowerCase().includes(search.toLowerCase())
      const byTab =
        tab === 'all' || (tab === 'unread' && m.unread > 0) || (tab === 'hot' && m.hot)
      return bySearch && byTab
    })
  }, [search, tab])

  const activeMessage = filteredMessages[active] || filteredMessages[0] || messages[0] || { id: 'empty', name: 'Sem conversas', last: '', time: '', unread: 0, hot: false, avatar: 'SC', color: '#94a3b8' }
  const activeConversation = conversationMap[activeMessage.id] || defaultChatHistory

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessage.id, activeConversation.length])

  useEffect(() => {
    if (active > filteredMessages.length - 1) setActive(0)
  }, [filteredMessages.length, active])

  const sendMessage = () => {
    if (!msg.trim()) return

    setConversationMap((prev) => ({
      ...prev,
      [activeMessage.id]: [
        ...(prev[activeMessage.id] || defaultChatHistory),
        {
          from: 'user',
          text: msg.trim(),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }))
    setMsg('')
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: '#f8fafc' }}>
      <div style={{ width: 336, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>WhatsApp IA</div>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Conectado · espelhando conversas
              </div>
            </div>
            <button style={{ border: '1px solid #e2e8f0', background: '#fff', borderRadius: 9, padding: '6px 9px', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>Sincronizar</button>
          </div>

          <div style={{ position: 'relative', marginBottom: 10 }}>
            <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <Icon d={icons.search} size={14} />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contato ou mensagem..."
              style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', background: '#f8fafc', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'unread', label: 'Não lidas' },
              { id: 'hot', label: 'Quentes' },
            ].map((item) => {
              const activeTab = tab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  style={{ border: '1px solid', borderColor: activeTab ? '#bfdbfe' : '#e2e8f0', background: activeTab ? '#eff6ff' : '#fff', color: activeTab ? '#1d4ed8' : '#64748b', borderRadius: 8, padding: '5px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredMessages.map((m, i) => {
            const isActive = activeMessage.id === m.id
            return (
              <div
                key={m.id}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  background: isActive ? '#eff6ff' : '#fff',
                  borderBottom: '1px solid #f8fafc',
                  borderLeft: isActive ? '3px solid #1a56db' : '3px solid transparent',
                  transition: 'background 0.16s ease',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Avatar initials={m.avatar} color={m.color} size={40} />
                  {m.hot && <div style={{ position: 'absolute', top: -2, right: -2, width: 11, height: 11, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff' }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{m.name}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{m.last}</div>
                </div>

                {m.unread > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: '50%', background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{m.unread}</div>}
              </div>
            )
          })}

          {filteredMessages.length === 0 && (
            <div style={{ padding: 20, fontSize: 12, color: '#94a3b8' }}>Nenhuma conversa encontrada para esse filtro.</div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <div style={{ padding: '12px 18px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={activeMessage.avatar} color={activeMessage.color} size={38} />

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{activeMessage.name}</div>
            <div style={{ fontSize: 11, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Conversa espelhada em tempo real
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onOpenLeadProfile?.(activeMessage)} style={{ padding: '7px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>Ver perfil</button>
            <button style={{ padding: '7px 12px', borderRadius: 10, border: 'none', background: '#1a56db', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Assumir conversa</button>
          </div>
        </div>

        <div style={{ margin: '12px 18px 0', padding: '9px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon d={icons.zap} size={13} stroke="#10b981" />
          <span style={{ fontSize: 11, color: '#166534', fontWeight: 600 }}>Agente IA sugerindo próximos passos de qualificação e resposta.</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {activeConversation.map((c, i) => (
            <div key={`${activeMessage.id}-${i}`} style={{ display: 'flex', justifyContent: c.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px 13px',
                  borderRadius: c.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: c.from === 'user' ? '#dcf8c6' : '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  border: c.from === 'bot' ? '1px solid #e2e8f0' : 'none',
                }}
              >
                {c.from === 'bot' && <div style={{ fontSize: 9, fontWeight: 700, color: '#1a56db', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zeety IA</div>}
                <div style={{ fontSize: 12, color: '#0f172a', lineHeight: 1.5 }}>{c.text}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>{c.time}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '12px 18px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <Icon d={icons.upload} size={15} />
          </button>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage()
            }}
            placeholder="Responder no WhatsApp..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc', fontFamily: 'inherit' }}
          />
          <button onClick={sendMessage} style={{ width: 38, height: 38, borderRadius: 10, background: '#1a56db', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={icons.send} size={16} stroke="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}
