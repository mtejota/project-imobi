import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const STAGES = ['Prospecção', 'Visita', 'Proposta', 'Negociação', 'Fechamento']
const stageColor = { Prospecção: '#64748b', Visita: '#3b82f6', Proposta: '#f59e0b', Negociação: '#f97316', Fechamento: '#10b981' }

const propostas = [
  { id: 1, valor: 'R$ 750.000', status: 'Pendente', date: '06/03/2026', sent: true },
  { id: 2, valor: 'R$ 720.000', status: 'Recusado', date: '04/03/2026', sent: true },
  { id: 3, valor: 'R$ 680.000', status: 'Recusado', date: '01/03/2026', sent: true },
]

const timeline = [
  { icon: 'zap', color: '#f59e0b', bg: '#fffbeb', text: 'IA prevê 87% de chance de fechamento nesta semana', time: 'há 5 min' },
  { icon: 'file', color: '#3b82f6', bg: '#eff6ff', text: 'Proposta de R$ 750.000 enviada ao lead via WhatsApp', time: 'hoje 09:15' },
  { icon: 'whatsapp', color: '#10b981', bg: '#f0fdf4', text: "Lead respondeu: 'Vou conversar com minha esposa e retorno amanhã'", time: 'ontem 16:40' },
  { icon: 'edit', color: '#8b5cf6', bg: '#f5f3ff', text: 'Proposta ajustada de R$ 720.000 para R$ 750.000', time: '05/03 14:00' },
  { icon: 'x', color: '#ef4444', bg: '#fef2f2', text: 'Proposta de R$ 720.000 recusada pelo lead', time: '04/03 11:20' },
  { icon: 'calendar', color: '#3b82f6', bg: '#eff6ff', text: 'Visita realizada — Lead demonstrou alto interesse', time: '02/03 10:00' },
]

export default function ScreenNegotiationDetail({ negotiation, onBack }) {
  const base = {
    id: 'NEG-0047',
    lead: { name: negotiation?.name || 'João Ferreira', avatar: negotiation?.avatar || 'JF', color: negotiation?.color || '#ef4444', phone: '(11) 98765-4321' },
    property: { title: negotiation?.property || 'Ap. 2Q — Pinheiros', address: 'Rua dos Pinheiros, 1247, apto 82', price: negotiation?.value || 'R$ 750.000', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=80' },
    broker: { name: 'Lucas Correia', avatar: 'LC' },
    stage: negotiation?.stage || 'Negociação',
    days: negotiation?.days || 12,
    commission: 'R$ 22.500',
    commissionPct: '3%',
    aiPredict: 87,
  }

  const [tab, setTab] = useState('propostas')
  const [currentStage, setCurrentStage] = useState(base.stage)
  const [showNovaProposta, setShowNovaProposta] = useState(false)
  const [novaValor, setNovaValor] = useState('750000')
  const [novaObs, setNovaObs] = useState('')
  const stageIdx = STAGES.indexOf(currentStage)
  const [pipelineProgress, setPipelineProgress] = useState(0)
  const targetProgress = Math.max(0, ((stageIdx + 1) / STAGES.length) * 100)

  useEffect(() => {
    const t = requestAnimationFrame(() => setPipelineProgress(targetProgress))
    return () => cancelAnimationFrame(t)
  }, [targetProgress])

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <style>{`@keyframes pipelineFlow{0%{transform:translateX(-120%)}100%{transform:translateX(220%)}}`}</style>
      {showNovaProposta && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 460, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Nova Proposta</div>
              <button onClick={() => setShowNovaProposta(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.x} size={14} stroke="#64748b" />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Valor da proposta</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #1a56db', borderRadius: 12, overflow: 'hidden' }}>
                <span style={{ padding: '0 14px', height: 44, background: '#eff6ff', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 700, color: '#1a56db' }}>R$</span>
                <input type="number" value={novaValor} onChange={(e) => setNovaValor(e.target.value)} style={{ flex: 1, height: 44, padding: '0 14px', border: 'none', outline: 'none', fontSize: 16, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: '#0f172a' }} />
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>Valor pedido: R$ 750.000 · Margem: {novaValor ? `R$ ${(750000 - Number(novaValor)).toLocaleString('pt-BR')}` : '—'}</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Condições especiais</label>
              <textarea value={novaObs} onChange={(e) => setNovaObs(e.target.value)} placeholder="Ex: financiamento, data de entrega, mobília inclusa..." style={{ width: '100%', minHeight: 80, padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: 1.6 }} />
            </div>
            <div style={{ background: '#fffbeb', borderRadius: 12, padding: '12px 14px', marginBottom: 20, display: 'flex', gap: 8 }}>
              <Icon d={icons.zap} size={14} stroke="#f59e0b" />
              <span style={{ fontSize: 12, color: '#92400e' }}>IA vai gerar o PDF da proposta e enviar ao lead via WhatsApp automaticamente.</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNovaProposta(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancelar
              </button>
              <button onClick={() => setShowNovaProposta(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon d={icons.send} size={13} stroke="#fff" /> Gerar e Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          <Icon d={icons.back} size={15} /> Pipeline
        </button>
        <span style={{ color: '#e2e8f0' }}>›</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{base.id}</span>
        <span style={{ color: '#e2e8f0' }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{base.lead.name}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 700, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
            <Icon d={icons.whatsapp} size={13} stroke="#10b981" /> Contatar lead
          </button>
          <button onClick={() => setShowNovaProposta(true)} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#1a56db', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
            <Icon d={icons.plus} size={13} stroke="#fff" /> Nova Proposta
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>
        <div style={{ padding: '0 32px 28px' }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${base.lead.color}20`, border: `3px solid ${base.lead.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: base.lead.color }}>{base.lead.avatar}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{base.lead.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{base.lead.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1.5, padding: '0 20px', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                <img src={base.property.img} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{base.property.title}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{base.property.address}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1a56db', fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{base.property.price}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', paddingLeft: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Comissão estimada</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981', fontFamily: "'DM Mono', monospace" }}>{base.commission}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{base.commissionPct} sobre {base.property.price}</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Progresso no Pipeline</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {STAGES.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STAGES.length - 1 ? 1 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => setCurrentStage(s)}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < stageIdx ? stageColor[s] : i === stageIdx ? stageColor[s] : '#f1f5f9', border: `2px solid ${i <= stageIdx ? stageColor[s] : '#e2e8f0'}`, fontSize: 12, fontWeight: 800, color: i <= stageIdx ? '#fff' : '#94a3b8', boxShadow: i === stageIdx ? `0 0 0 4px ${stageColor[s]}30` : 'none' }}>
                      {i < stageIdx ? <Icon d={icons.check} size={14} stroke="#fff" strokeWidth={2.5} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: i === stageIdx ? 700 : 400, color: i === stageIdx ? stageColor[s] : '#94a3b8', whiteSpace: 'nowrap' }}>{s}</span>
                  </div>
                  {i < STAGES.length - 1 && <div style={{ flex: 1, height: 3, background: i < stageIdx ? stageColor[STAGES[i + 1]] : '#f1f5f9', margin: '0 4px', marginBottom: 22, borderRadius: 2 }} />}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 8, borderRadius: 8, background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pipelineProgress}%`, borderRadius: 8, background: `linear-gradient(90deg, ${stageColor[currentStage]}cc, ${stageColor[currentStage]})`, position: 'relative', overflow: 'hidden', transition: 'width 0.65s ease' }}>
                  <div style={{ position: 'absolute', inset: 0, width: '35%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))', animation: 'pipelineFlow 1.2s linear infinite' }} />
                </div>
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8' }}>
                <span>Etapa atual: {currentStage}</span>
                <span style={{ fontWeight: 700, color: stageColor[currentStage] }}>{Math.round(targetProgress)}%</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #f1f5f9', marginBottom: 24 }}>
            {[
              { id: 'propostas', label: 'Propostas' },
              { id: 'timeline', label: 'Histórico' },
              { id: 'docs', label: 'Documentos' },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 22px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 800 : 500, color: tab === t.id ? '#1a56db' : '#64748b', borderBottom: `2px solid ${tab === t.id ? '#1a56db' : 'transparent'}`, marginBottom: -2, fontFamily: 'inherit' }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'propostas' && (
            <div>
              {propostas.map((p, i) => {
                const statusCol = { Pendente: '#f59e0b', Recusado: '#ef4444', Aceito: '#10b981' }
                const statusBg = { Pendente: '#fffbeb', Recusado: '#fef2f2', Aceito: '#f0fdf4' }
                return (
                  <div key={p.id} style={{ background: '#fff', borderRadius: 16, border: `1px solid ${i === 0 ? '#bfdbfe' : '#f1f5f9'}`, padding: '20px 22px', marginBottom: 12, boxShadow: i === 0 ? '0 2px 12px rgba(26,86,219,0.08)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>PROPOSTA #{p.id} · {p.date}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{p.valor}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20, background: statusBg[p.status], color: statusCol[p.status] }}>{p.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 11, fontWeight: 700, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
                        <Icon d={icons.download} size={12} /> Baixar PDF
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'timeline' && (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: '#f1f5f9' }} />
              {timeline.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 18, position: 'relative' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: ev.bg, border: `2px solid ${ev.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                    <Icon d={icons[ev.icon] || icons.zap} size={13} stroke={ev.color} />
                  </div>
                  <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '13px 16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{ev.text}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon d={icons.clock} size={11} /> {ev.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'docs' && (
            <div>
              {[
                { name: 'Proposta Comercial #1.pdf', status: 'Aprovado', color: '#10b981' },
                { name: 'RG + CPF — João Ferreira.pdf', status: 'Recebido', color: '#3b82f6' },
                { name: 'Contrato Compra e Venda.docx', status: 'Pendente Assinatura', color: '#f59e0b' },
                { name: 'Comprovante de Renda.pdf', status: 'Pendente', color: '#ef4444' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${d.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={icons.file} size={16} stroke={d.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{d.name}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: `${d.color}15`, color: d.color }}>{d.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderLeft: '1px solid #f1f5f9', padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Icon d={icons.zap} size={14} stroke="#22c55e" />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>Previsão da IA</span>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: '#10b981', fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{base.aiPredict}%</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>chance de fechamento</div>
            </div>
            <div style={{ marginTop: 14, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${base.aiPredict}%`, background: 'linear-gradient(90deg, #10b981, #22c55e)', borderRadius: 4 }} />
            </div>
            <div style={{ marginTop: 14, padding: 12, background: '#1e293b', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>Sugestão da IA</div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>Lead mencionou aprovação bancária. Ofereça prazo de entrega flexível para acelerar o fechamento.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
