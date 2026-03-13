import { useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const defaultLead = {
  id: 1,
  name: 'João Ferreira',
  phone: '(11) 98765-4321',
  email: 'joao.ferreira@email.com',
  avatar: 'JF',
  color: '#ef4444',
  score: 92,
  tag: 'Quente',
  source: 'WhatsApp',
  budget: 'R$ 750.000',
  type: 'Apartamento 2 Quartos',
  region: 'Pinheiros, São Paulo',
  created: '02/03/2026',
  lastContact: 'há 5 min',
  stage: 'Negociação',
  notes:
    'Cliente muito interessado no apartamento de Pinheiros. Tem aprovação de crédito no banco. Quer fechar até o final do mês. Preferência por andar alto e varanda.',
  tags: ['Comprador', 'Crédito aprovado', 'Urgente'],
  broker: { name: 'Lucas Correia', avatar: 'LC' },
}

const timeline = [
  { type: 'whatsapp', text: "Lead enviou mensagem: 'Posso ver o apartamento amanhã às 10h?'", time: 'há 5 min', icon: 'whatsapp', color: '#10b981', bg: '#f0fdf4' },
  { type: 'ai', text: 'IA qualificou lead — Score atualizado para 92 (era 85)', time: 'há 5 min', icon: 'zap', color: '#f59e0b', bg: '#fffbeb' },
  { type: 'visit', text: 'Visita agendada para 08/03 às 10h — Ap. 2Q Pinheiros 450m²', time: 'há 10 min', icon: 'calendar', color: '#3b82f6', bg: '#eff6ff' },
  { type: 'doc', text: 'Documentos solicitados: RG, CPF, Comprovante de Renda', time: 'ontem 15:30', icon: 'file', color: '#8b5cf6', bg: '#f5f3ff' },
  { type: 'whatsapp', text: "Lead enviou: 'Estou muito interessado, qual o valor exato?'", time: 'ontem 14:22', icon: 'whatsapp', color: '#10b981', bg: '#f0fdf4' },
  { type: 'ai', text: 'IA enviou follow-up automático (Estágio 1)', time: 'ontem 09:00', icon: 'zap', color: '#f59e0b', bg: '#fffbeb' },
  { type: 'created', text: 'Lead criado via WhatsApp — primeira mensagem recebida', time: '02/03/2026 10:15', icon: 'plus', color: '#64748b', bg: '#f8fafc' },
]

const matchedProperties = [
  { id: 1, title: 'Ap. 2Q — Pinheiros', price: 'R$ 750.000', area: '78m²', score: 98, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&q=80' },
  { id: 2, title: 'Ap. 2Q — Vila Madalena', price: 'R$ 680.000', area: '72m²', score: 87, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80' },
  { id: 3, title: 'Ap. 3Q — Perdizes', price: 'R$ 790.000', area: '94m²', score: 74, img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80' },
]

const stageColors = { Prospecção: '#64748b', Visita: '#3b82f6', Proposta: '#f59e0b', Negociação: '#f97316', Fechamento: '#10b981' }
const stages = ['Prospecção', 'Visita', 'Proposta', 'Negociação', 'Fechamento']

export default function ScreenLeadProfile({ onBack, leadData, onOpenEdit, onSendMessage }) {
  const lead = leadData || defaultLead
  const [activeTab, setActiveTab] = useState('timeline')
  const [note, setNote] = useState('')
  const [currentStage, setCurrentStage] = useState(lead.stage)
  const [showStageMenu, setShowStageMenu] = useState(false)
  const [msg, setMsg] = useState('')

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '20px 24px' }}>
      <style>{`
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
      `}</style>

      <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          <Icon d={icons.back} size={15} /> Leads
        </button>
        <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{lead.name}</span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={onOpenEdit} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 700, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={icons.edit} size={13} /> Editar
          </button>
          <button onClick={onSendMessage} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#1a56db', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon d={icons.support} size={13} /> Contato
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', minHeight: 'calc(100vh - 220px)' }}>
        <div style={{ background: '#fff', borderRight: '1px solid #f1f5f9', overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <svg width={96} height={96} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={48} cy={48} r={42} fill="none" stroke="#f1f5f9" strokeWidth={6} />
                <circle cx={48} cy={48} r={42} fill="none" stroke={lead.color} strokeWidth={6} strokeDasharray={`${(2 * Math.PI * 42 * lead.score) / 100} ${2 * Math.PI * 42}`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${lead.color}18`, border: `3px solid ${lead.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: lead.color, fontFamily: "'DM Mono', monospace" }}>{lead.avatar}</div>
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{lead.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Score de qualificação IA</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: lead.color, fontFamily: "'DM Mono', monospace", lineHeight: 1, marginTop: 4 }}>{lead.score}</div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Estágio no Pipeline</div>
            <button onClick={() => setShowStageMenu(!showStageMenu)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `2px solid ${stageColors[currentStage]}`, background: `${stageColors[currentStage]}10`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stageColors[currentStage] }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: stageColors[currentStage] }}>{currentStage}</span>
              </div>
              <Icon d="M6 9l6 6 6-6" size={14} stroke={stageColors[currentStage]} />
            </button>
            {showStageMenu && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 20, overflow: 'hidden', marginTop: 4 }}>
                {stages.map((s) => (
                  <button key={s} onClick={() => { setCurrentStage(s); setShowStageMenu(false) }} style={{ width: '100%', padding: '10px 14px', border: 'none', background: currentStage === s ? `${stageColors[s]}10` : '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: stageColors[s] }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{s}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Contato</div>
            {[
              { icon: icons.whatsapp, label: lead.phone, color: '#10b981' },
              { icon: icons.mail, label: lead.email, color: '#3b82f6' },
              { icon: icons.mappin, label: lead.region, color: '#8b5cf6' },
            ].map(({ icon, label, color }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={icon} size={13} stroke={color} />
                </div>
                <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #f1f5f9', marginBottom: 24 }}>
            {[
              { id: 'timeline', label: 'Histórico' },
              { id: 'notes', label: 'Anotações' },
              { id: 'matches', label: 'Imóveis Compatíveis' },
              { id: 'docs', label: 'Documentos' },
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t.id ? 800 : 500, color: activeTab === t.id ? '#1a56db' : '#64748b', borderBottom: `2px solid ${activeTab === t.id ? '#1a56db' : 'transparent'}`, marginBottom: -2, fontFamily: 'inherit' }}>{t.label}</button>
            ))}
          </div>

          {activeTab === 'timeline' && (
            <div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: '#f1f5f9' }} />
                {timeline.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, position: 'relative' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: ev.bg, border: `2px solid ${ev.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                      <Icon d={icons[ev.icon] || icons.zap} size={13} stroke={ev.color} />
                    </div>
                    <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{ev.text}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon d={icons.clock} size={11} />
                        {ev.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{lead.notes}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Adicionar anotação..." style={{ width: '100%', minHeight: 100, padding: '16px', border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', color: '#374151' }} />
                <div style={{ padding: '10px 16px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: note ? '#1a56db' : '#f1f5f9', color: note ? '#fff' : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: note ? 'pointer' : 'default', fontFamily: 'inherit' }}>Salvar anotação</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {matchedProperties.map((p) => (
                  <div key={p.id} className="card-hover" style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', display: 'flex', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}>
                    <img src={p.img} alt={p.title} style={{ width: 140, height: 110, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{p.title}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#1a56db', fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{p.price}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{p.area}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: p.score >= 90 ? '#10b981' : p.score >= 75 ? '#f59e0b' : '#3b82f6', fontFamily: "'DM Mono', monospace" }}>{p.score}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div>
              <div style={{ marginTop: 20, background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f8fafc', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Enviar lembrete de documentos</div>
                <div style={{ padding: '16px 18px', display: 'flex', gap: 10 }}>
                  <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Mensagem personalizada..." style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#f8fafc' }} />
                  <button style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon d={icons.send} size={14} stroke="#fff" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
