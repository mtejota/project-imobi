import { useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const DOC_TEMPLATES = {
  'Compra Financiada': ['RG + CPF', 'Certidão de Nascimento/Casamento', 'Comprovante de Renda (3 meses)', 'Extratos Bancários (3 meses)', 'Comprovante de Residência', 'Imposto de Renda', 'FGTS (extrato)'],
  'Compra à Vista': ['RG + CPF', 'Certidão de Nascimento/Casamento', 'Comprovante de Renda', 'Comprovante de Residência', 'Declaração de IR'],
  Locação: ['RG + CPF', 'Comprovante de Renda (3x aluguel)', 'Ficha Cadastral', 'Comprovante de Residência'],
}

const STATUS_CONFIG = {
  Pendente: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  'Enviado ao lead': { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  Recebido: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  Aprovado: { color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
  Reprovado: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
}

const initialDocs = [
  { id: 1, name: 'RG + CPF', status: 'Aprovado', reminder: 0, receivedAt: '06/03' },
  { id: 2, name: 'Comprovante de Renda', status: 'Recebido', reminder: 0, receivedAt: '06/03' },
  { id: 3, name: 'Extratos Bancários', status: 'Enviado ao lead', reminder: 1, receivedAt: null },
  { id: 4, name: 'Comprovante de Residência', status: 'Pendente', reminder: 2, receivedAt: null },
  { id: 5, name: 'Certidão de Casamento', status: 'Pendente', reminder: 0, receivedAt: null },
  { id: 6, name: 'FGTS (extrato)', status: 'Pendente', reminder: 0, receivedAt: null },
]

export default function ScreenRequestDocuments({ onBack, leads = [] }) {
  const leadOptions = leads.slice(0, 3).map((lead, index) => ({
    id: lead.id,
    name: lead.name || `Lead ${index + 1}`,
    avatar: lead.avatar || String(lead.name || `L${index + 1}`).slice(0, 2).toUpperCase(),
    color: lead.color || ['#8b5cf6', '#ef4444', '#10b981'][index % 3],
    stage: lead.stage || 'Em análise',
  }))
  const [selectedLead, setSelectedLead] = useState(leadOptions[0] || null)
  const [template, setTemplate] = useState('Compra Financiada')
  const [docs, setDocs] = useState(initialDocs)
  const [newDoc, setNewDoc] = useState('')
  const [activeTab, setActiveTab] = useState('checklist')
  const [sending, setSending] = useState(false)
  const [sentMsg, setSentMsg] = useState(false)
  const [msgText, setMsgText] = useState('Olá. Para prosseguirmos com a negociação, precisamos dos documentos abaixo. Você pode enviar por aqui assim que estiver com tudo separado.')

  const updateStatus = (id, status) => setDocs((ds) => ds.map((d) => (d.id === id ? { ...d, status } : d)))
  const removeDoc = (id) => setDocs((ds) => ds.filter((d) => d.id !== id))

  const addDoc = () => {
    if (!newDoc.trim()) return
    setDocs((ds) => [...ds, { id: Date.now(), name: newDoc.trim(), status: 'Pendente', reminder: 0, receivedAt: null }])
    setNewDoc('')
  }

  const handleSend = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSentMsg(true)
      setTimeout(() => setSentMsg(false), 3000)
    }, 1400)
  }

  const approvedOrReceived = docs.filter((d) => d.status === 'Aprovado' || d.status === 'Recebido').length
  const pct = docs.length ? Math.round((approvedOrReceived / docs.length) * 100) : 0

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      {sentMsg && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, zIndex: 200, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <Icon d={icons.whatsapp} size={15} stroke="#10b981" /> Solicitação enviada via WhatsApp
        </div>
      )}

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '24px 24px 32px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
              <Icon d={icons.back} size={15} /> Documentos
            </button>
            <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Solicitar Documentos</span>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Lead / Negociação</div>
            {!leadOptions.length ? (
              <div style={{ border: '1px dashed #cbd5e1', borderRadius: 12, background: '#f8fafc', padding: '18px 16px', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                Nenhum lead disponível no momento. Quando o backend retornar negociações ativas, a seleção aparecerá aqui.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
              {leadOptions.map((l) => (
                <button key={l.id} onClick={() => setSelectedLead(l)} style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: `2px solid ${selectedLead.id === l.id ? l.color : '#f1f5f9'}`, background: selectedLead.id === l.id ? `${l.color}10` : '#fff', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${l.color}20`, border: `2px solid ${l.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: l.color, flexShrink: 0 }}>{l.avatar}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{l.name}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{l.stage}</div>
                  </div>
                </button>
              ))}
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Progresso do checklist</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: pct === 100 ? '#10b981' : '#1a56db', fontFamily: "'DM Mono', monospace" }}>{pct}%</div>
            </div>
            <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#10b981' : 'linear-gradient(90deg, #1a56db, #3b82f6)', borderRadius: 5, transition: 'width 0.4s' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #f1f5f9', marginBottom: 20 }}>
              {[{ id: 'checklist', label: 'Checklist' }, { id: 'template', label: 'Usar template' }].map((t) => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '10px 22px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t.id ? 800 : 500, color: activeTab === t.id ? '#1a56db' : '#64748b', borderBottom: `2px solid ${activeTab === t.id ? '#1a56db' : 'transparent'}`, marginBottom: -2, fontFamily: 'inherit' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'checklist' && (
              <div>
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr 1fr 100px', padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                    {['Documento', 'Status', 'Lembretes', 'Ações'].map((h) => (
                      <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {h}
                      </span>
                    ))}
                  </div>
                  {docs.map((doc, i) => {
                    const cfg = STATUS_CONFIG[doc.status]
                    return (
                      <div key={doc.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr 1fr 100px', padding: '14px 20px', alignItems: 'center', borderBottom: i < docs.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon d={icons.file} size={15} stroke={cfg.color} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{doc.name}</div>
                            {doc.receivedAt && <div style={{ fontSize: 10, color: '#94a3b8' }}>Recebido em {doc.receivedAt}</div>}
                          </div>
                        </div>
                        <div>
                          <select value={doc.status} onChange={(e) => updateStatus(doc.id, e.target.value)} style={{ padding: '5px 10px', borderRadius: 20, border: `1px solid ${cfg.border}`, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', appearance: 'none' }}>
                            {Object.keys(STATUS_CONFIG).map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{doc.reminder > 0 ? `${doc.reminder}x enviado` : '-'}</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button title="Lembrete WhatsApp" style={{ width: 28, height: 28, borderRadius: 8, background: '#f0fdf4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon d={icons.bell} size={12} stroke="#10b981" />
                          </button>
                          <button onClick={() => removeDoc(doc.id)} title="Remover" style={{ width: 28, height: 28, borderRadius: 8, background: '#fef2f2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon d={icons.trash} size={12} stroke="#ef4444" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={newDoc}
                    onChange={(e) => setNewDoc(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addDoc()}
                    placeholder="Adicionar documento ao checklist..."
                    style={{ flex: 1, height: 40, padding: '0 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                  />
                  <button onClick={addDoc} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: '#1a56db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={icons.plus} size={15} stroke="#fff" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'template' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  {Object.keys(DOC_TEMPLATES).map((t) => (
                    <button key={t} onClick={() => setTemplate(t)} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `2px solid ${template === t ? '#1a56db' : '#e2e8f0'}`, background: template === t ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: template === t ? '#1a56db' : '#64748b', fontFamily: 'inherit' }}>
                      {t}
                    </button>
                  ))}
                </div>
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '16px 20px', marginBottom: 16 }}>
                  {DOC_TEMPLATES[template].map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < DOC_TEMPLATES[template].length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon d={icons.check} size={11} stroke="#10b981" strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: 13, color: '#374151' }}>{d}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setDocs(DOC_TEMPLATES[template].map((d, i) => ({ id: Date.now() + i, name: d, status: 'Pendente', reminder: 0, receivedAt: null })))
                    setActiveTab('checklist')
                  }}
                  style={{ width: '100%', padding: 11, borderRadius: 12, border: 'none', background: '#eff6ff', color: '#1a56db', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Usar este template no checklist
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.whatsapp} size={16} stroke="#10b981" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Enviar solicitação via WhatsApp</div>
            </div>
            {selectedLead && (
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
                Envio preparado para <strong style={{ color: '#0f172a' }}>{selectedLead.name}</strong>
              </div>
            )}
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: 1.6, marginBottom: 12 }}
            />
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 12 }}>A lista de documentos sera adicionada automaticamente.</div>
            <button onClick={handleSend} disabled={sending || !selectedLead} style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: sending || !selectedLead ? '#94a3b8' : '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: sending || !selectedLead ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
              {sending ? 'Enviando...' : selectedLead ? `Enviar para ${selectedLead.name}` : 'Aguardando lead'}
            </button>
          </div>

          <div style={{ background: '#0f172a', borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Icon d={icons.zap} size={14} stroke="#22c55e" />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>Automação IA</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>A IA monitora os documentos pendentes e envia lembretes automáticos:</div>
            {[
              { label: 'Após 48h sem envio', badge: '1º lembrete' },
              { label: 'Após 96h sem envio', badge: '2º lembrete' },
              { label: 'Após 144h sem envio', badge: 'Alerta corretor' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#64748b', flex: 1 }}>{r.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#1e293b', color: '#10b981' }}>{r.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
