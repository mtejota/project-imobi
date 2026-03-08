import { useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const CATEGORIES = ['Problema técnico', 'Erro de integração', 'Cobrança', 'Sugestão', 'Outro']
const PRIORITIES = ['Baixa', 'Média', 'Alta']

export default function ScreenSupport() {
  const [category, setCategory] = useState(CATEGORIES[0])
  const [priority, setPriority] = useState(PRIORITIES[1])
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState([])
  const [sending, setSending] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const inputRef = useRef(null)

  const canSend = useMemo(() => subject.trim() && description.trim(), [subject, description])

  const onFiles = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const mapped = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      file,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }))
    setAttachments((prev) => [...prev, ...mapped])
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const item = prev.find((att) => att.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return prev.filter((att) => att.id !== id)
    })
  }

  const submitTicket = () => {
    if (!canSend) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setTicketId(`SUP-${Math.floor(10000 + Math.random() * 90000)}`)
    }, 1000)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1050, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Suporte</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Abra um chamado com detalhes do problema e anexe imagens para agilizar o atendimento.</div>
        </div>

        {ticketId && (
          <div style={{ marginBottom: 14, border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#166534', borderRadius: 12, padding: '10px 12px', fontSize: 12, fontWeight: 700 }}>
            Chamado criado com sucesso: {ticketId}. Nossa equipe responderá em breve.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <Field label="Categoria">
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Field>

              <Field label="Prioridade">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
                  {PRIORITIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Assunto">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex: Erro ao sincronizar WhatsApp" style={inputStyle} />
            </Field>

            <Field label="Descreva o ocorrido">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Informe o que aconteceu, quando aconteceu e qual impacto no atendimento." style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }} />
            </Field>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complementos (imagens)</div>
              <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: 'none' }} />
              <button onClick={() => inputRef.current?.click()} style={{ border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon d={icons.upload} size={13} /> Anexar imagens
              </button>
            </div>

            {attachments.length > 0 && (
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                {attachments.map((att) => (
                  <div key={att.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                    {att.preview ? (
                      <img src={att.preview} alt={att.name} style={{ width: '100%', height: 90, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: 90, display: 'grid', placeItems: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: 11 }}>{att.name}</div>
                    )}
                    <div style={{ padding: '8px 8px 6px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.name}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>{att.size}</div>
                      <button onClick={() => removeAttachment(att.id)} style={{ marginTop: 6, border: 'none', background: '#fef2f2', color: '#ef4444', borderRadius: 8, padding: '4px 7px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Remover</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button disabled={!canSend || sending} onClick={submitTicket} style={{ border: 'none', background: canSend ? '#1a56db' : '#cbd5e1', color: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 700, cursor: canSend ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                {sending ? 'Enviando...' : 'Abrir chamado'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Dicas para acelerar o suporte</div>
              <ul style={{ margin: 0, paddingLeft: 16, color: '#64748b', fontSize: 12, lineHeight: 1.7 }}>
                <li>Informe horário e contexto do erro.</li>
                <li>Descreva passos para reproduzir.</li>
                <li>Anexe print da tela com o problema.</li>
              </ul>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1d4ed8', marginBottom: 6 }}>SLA estimado</div>
              <div style={{ fontSize: 12, color: '#1e3a8a', lineHeight: 1.6 }}>Alta: até 2h<br />Média: até 8h<br />Baixa: até 24h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {children}
    </label>
  )
}

const inputStyle = { width: '100%', borderRadius: 12, border: '1px solid #e2e8f0', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff' }
