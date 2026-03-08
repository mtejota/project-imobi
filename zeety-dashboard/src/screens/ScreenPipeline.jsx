import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar'
import { pipeline as initialPipeline } from '../data'

export default function ScreenPipeline({ onOpenNegotiationDetail, onOpenNewNegotiation }) {
  const stageColors = { Prospecção: '#64748b', Visita: '#3b82f6', Proposta: '#f59e0b', Negociação: '#f97316', Fechamento: '#10b981' }
  const stages = Object.keys(initialPipeline)
  const [pipelineState, setPipelineState] = useState(() =>
    Object.fromEntries(stages.map((stage) => [stage, [...initialPipeline[stage]]]))
  )
  const [draggingCardId, setDraggingCardId] = useState(null)
  const [draggingFromStage, setDraggingFromStage] = useState('')
  const [dragOverStage, setDragOverStage] = useState('')
  const [pendingMove, setPendingMove] = useState(null)

  const total = useMemo(
    () => stages.reduce((sum, stage) => sum + pipelineState[stage].length, 0),
    [pipelineState, stages]
  )

  const handleDragStart = (cardId, fromStage) => {
    setDraggingCardId(cardId)
    setDraggingFromStage(fromStage)
  }

  const handleDropOnStage = (targetStage) => {
    if (!draggingCardId || !draggingFromStage || draggingFromStage === targetStage) {
      setDragOverStage('')
      return
    }

    const card = pipelineState[draggingFromStage].find((item) => item.id === draggingCardId)
    if (!card) return

    setPendingMove({ card, fromStage: draggingFromStage, toStage: targetStage })
    setDragOverStage('')
  }

  const applyPendingMove = () => {
    if (!pendingMove) return

    setPipelineState((current) => {
      const next = { ...current }
      next[pendingMove.fromStage] = current[pendingMove.fromStage].filter((item) => item.id !== pendingMove.card.id)
      next[pendingMove.toStage] = [pendingMove.card, ...current[pendingMove.toStage]]
      return next
    })

    setPendingMove(null)
    setDraggingCardId(null)
    setDraggingFromStage('')
  }

  const cancelPendingMove = () => {
    setPendingMove(null)
    setDraggingCardId(null)
    setDraggingFromStage('')
    setDragOverStage('')
  }

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%', position: 'relative' }}>
      {pendingMove && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: 430, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Confirmar alteração de estágio</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 14 }}>
              Deseja mover <strong style={{ color: '#0f172a' }}>{pendingMove.card.name}</strong> de <strong style={{ color: '#0f172a' }}>{pendingMove.fromStage}</strong> para <strong style={{ color: '#0f172a' }}>{pendingMove.toStage}</strong>?
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{pendingMove.card.property}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{pendingMove.card.value} · {pendingMove.card.days}d em negociação</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={cancelPendingMove} style={{ flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancelar
              </button>
              <button onClick={applyPendingMove} style={{ flex: 1, border: 'none', background: '#1a56db', color: '#fff', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Confirmar mudança
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Pipeline de Negociações</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{total} negociações ativas · R$ 5.03M em carteira</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Ordenar por valor</button>
          <button onClick={onOpenNewNegotiation} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Negociação</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {stages.map((stage) => (
          <div
            key={stage}
            style={{
              minWidth: 220,
              flex: 1,
              background: dragOverStage === stage ? '#eff6ff' : 'transparent',
              borderRadius: 14,
              border: dragOverStage === stage ? '1px dashed #93c5fd' : '1px dashed transparent',
              transition: 'background 0.2s ease, border-color 0.2s ease',
              padding: 6,
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverStage(stage)
            }}
            onDragLeave={() => setDragOverStage((current) => (current === stage ? '' : current))}
            onDrop={(e) => {
              e.preventDefault()
              handleDropOnStage(stage)
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stageColors[stage] }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{stage}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: stageColors[stage], background: `${stageColors[stage]}18`, padding: '2px 8px', borderRadius: 20 }}>{pipelineState[stage].length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pipelineState[stage].map((card) => {
                const isDragging = draggingCardId === card.id

                return (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card.id, stage)}
                    onDragEnd={() => {
                      setDraggingCardId(null)
                      setDraggingFromStage('')
                      setDragOverStage('')
                    }}
                    style={{
                      background: '#fff',
                      borderRadius: 14,
                      padding: '14px 16px',
                      border: '1px solid #f1f5f9',
                      boxShadow: isDragging ? '0 14px 30px rgba(37,99,235,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease',
                      borderLeft: `3px solid ${stageColors[stage]}`,
                      transform: isDragging ? 'scale(1.02) rotate(0.4deg)' : 'none',
                      opacity: isDragging ? 0.85 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isDragging) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDragging) {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                      }
                    }}
                    onClick={() => onOpenNegotiationDetail?.({ ...card, stage })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <Avatar initials={card.avatar} color={card.color} size={30} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{card.name}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>{card.property}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{card.value}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{card.days}d</span>
                    </div>
                  </div>
                )
              })}
              <button onClick={onOpenNewNegotiation} style={{ width: '100%', padding: '10px', borderRadius: 14, border: '2px dashed #e2e8f0', background: 'transparent', color: '#cbd5e1', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>+ Adicionar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
