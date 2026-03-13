import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const TIMES = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
const DAYS_HEADER = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MARCH_OFFSET = 6
const BUSY_DAYS = [3, 5, 8, 10, 12, 15, 18, 20, 22, 27]
const COMMITMENT_TYPES = ['Visita', 'Reunião', 'Assinatura', 'Entrega de chaves']

export default function ScreenScheduleVisit({ leads = [], properties = [], onBack }) {
  const [selectedDay, setSelectedDay] = useState(10)
  const [selectedTime, setSelectedTime] = useState('10:00')
  const [selectedLead, setSelectedLead] = useState(leads[0] || null)
  const [selectedProperty, setSelectedProperty] = useState(properties[0] || null)
  const [type, setType] = useState('Visita')
  const [notes, setNotes] = useState('')
  const [sendReminder, setSendReminder] = useState(true)
  const [confirmIA, setConfirmIA] = useState(true)
  const [saved, setSaved] = useState(false)
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 1120)

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 1120)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const dayTimeline = useMemo(() => {
    const list = {
      10: [
        { time: '09:00', title: 'Visita anterior - Apto Moema', status: 'confirmado' },
        { time: '10:00', title: 'Visita principal selecionada', status: 'selecionado' },
        { time: '15:30', title: 'Retorno com proposta', status: 'pendente' },
      ],
      12: [
        { time: '08:30', title: 'Reunião com proprietário', status: 'confirmado' },
        { time: '14:30', title: 'Visita com lead novo', status: 'pendente' },
      ],
      15: [
        { time: '11:00', title: 'Assinatura de contrato', status: 'confirmado' },
      ],
    }

    return list[selectedDay] || [{ time: selectedTime, title: `${type} agendada`, status: 'selecionado' }]
  }, [selectedDay, selectedTime, type])

  if (saved) {
    return (
      <div style={{ height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 460, padding: 32, background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 10px 35px rgba(15,23,42,0.10)' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#f0fdf4', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <Icon d={icons.check} size={38} stroke='#10b981' strokeWidth={2.5} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Compromisso confirmado</div>
          <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 10 }}>
            <strong>{selectedLead?.name || 'Lead'}</strong> recebeu a confirmação automática.
            <br />
            <span style={{ fontFamily: "'DM Mono', monospace", color: '#1a56db' }}>
              {selectedDay}/03/2026 às {selectedTime}
            </span>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 14px', marginBottom: 22, display: 'flex', gap: 8, textAlign: 'left' }}>
            <Icon d={icons.zap} size={14} stroke='#10b981' />
            <span style={{ fontSize: 12, color: '#16a34a' }}>Lembrete H-2 e confirmação no WhatsApp foram programados.</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSaved(false)}
              style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              + Agendar outra
            </button>
            <button
              onClick={onBack}
              style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Voltar para agenda
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '24px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
            <Icon d={icons.back} size={15} /> Agenda
          </button>
          <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Agendar compromisso</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#1d4ed8', padding: '6px 10px', borderRadius: 20, border: '1px solid #bfdbfe', background: '#eff6ff' }}>Março 2026</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0,1fr) 340px', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Tipo de compromisso</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {COMMITMENT_TYPES.map((item) => (
                  <button
                    key={item}
                    onClick={() => setType(item)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: `2px solid ${type === item ? '#1a56db' : '#e2e8f0'}`,
                      background: type === item ? '#eff6ff' : '#fff',
                      color: type === item ? '#1a56db' : '#64748b',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Lead</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {leads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: `2px solid ${selectedLead?.id === lead.id ? '#1a56db' : '#f1f5f9'}`,
                        background: selectedLead?.id === lead.id ? '#eff6ff' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${lead.color}20`, border: `2px solid ${lead.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: lead.color, flexShrink: 0 }}>{lead.avatar}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{lead.name}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.phone}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Imóvel</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {properties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: `2px solid ${selectedProperty?.id === property.id ? '#1a56db' : '#f1f5f9'}`,
                        background: selectedProperty?.id === property.id ? '#eff6ff' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                      }}
                    >
                      <img src={property.img} alt='' style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.title}</div>
                        <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.address}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Selecionar data</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 13, color: '#64748b', fontFamily: 'inherit' }}>‹</button>
                  <span style={{ padding: '6px 10px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Março 2026</span>
                  <button style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 13, color: '#64748b', fontFamily: 'inherit' }}>›</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                {DAYS_HEADER.map((day) => (
                  <div key={day} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '4px 0' }}>
                    {day}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {Array.from({ length: MARCH_OFFSET }).map((_, index) => (
                  <div key={`e${index}`} />
                ))}

                {Array.from({ length: 31 }).map((_, index) => {
                  const day = index + 1
                  const isSelected = day === selectedDay
                  const isBusy = BUSY_DAYS.includes(day)
                  const isPast = day < 8

                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && setSelectedDay(day)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 9,
                        border: `1px solid ${isSelected ? '#1a56db' : 'transparent'}`,
                        background: isSelected ? '#1a56db' : 'transparent',
                        color: isSelected ? '#fff' : isPast ? '#d1d5db' : '#334155',
                        fontSize: 12,
                        fontWeight: isSelected ? 800 : 600,
                        cursor: isPast ? 'default' : 'pointer',
                        fontFamily: 'inherit',
                        position: 'relative',
                      }}
                    >
                      {day}
                      {isBusy && !isSelected && <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                Horários disponíveis para {selectedDay}/03
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TIMES.map((time) => {
                  const busy = ['09:00', '14:30'].includes(time)
                  const selected = time === selectedTime

                  return (
                    <button
                      key={time}
                      onClick={() => !busy && setSelectedTime(time)}
                      disabled={busy}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 10,
                        border: `2px solid ${selected ? '#1a56db' : busy ? '#f1f5f9' : '#e2e8f0'}`,
                        background: selected ? '#1a56db' : busy ? '#f8fafc' : '#fff',
                        color: selected ? '#fff' : busy ? '#cbd5e1' : '#334155',
                        fontSize: 12,
                        fontWeight: selected ? 800 : 700,
                        cursor: busy ? 'not-allowed' : 'pointer',
                        fontFamily: "'DM Mono', monospace",
                        textDecoration: busy ? 'line-through' : 'none',
                      }}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Observações</div>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder='Ex: informar portaria, ponto de encontro e documentos para visita.'
                style={{ width: '100%', minHeight: 90, padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', color: '#374151', lineHeight: 1.6 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#0f172a', borderRadius: 16, padding: '18px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>Resumo do agendamento</div>
              {[
                { icon: icons.note, label: 'Tipo', value: type },
                { icon: icons.calendar, label: 'Data', value: `${selectedDay}/03/2026` },
                { icon: icons.clock, label: 'Horário', value: selectedTime },
                { icon: icons.user, label: 'Lead', value: selectedLead?.name || '-' },
                { icon: icons.home, label: 'Imóvel', value: selectedProperty?.title || '-' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 10, marginBottom: 9, alignItems: 'center' }}>
                  <Icon d={item.icon} size={13} stroke='#64748b' />
                  <span style={{ fontSize: 11, color: '#64748b', width: 55, flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', wordBreak: 'break-word' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '16px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Roteiro do dia</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dayTimeline.map((item, index) => {
                  const color = item.status === 'confirmado' ? '#10b981' : item.status === 'selecionado' ? '#1a56db' : '#f59e0b'
                  const background = item.status === 'confirmado' ? '#f0fdf4' : item.status === 'selecionado' ? '#eff6ff' : '#fffbeb'
                  return (
                    <div key={`${item.time}-${index}`} style={{ borderRadius: 10, border: `1px solid ${color}35`, background, padding: '8px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color }}>{item.time}</span>
                        <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>{item.status}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#334155' }}>{item.title}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '16px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Automações</div>
              {[
                { val: sendReminder, set: setSendReminder, label: 'Enviar confirmação no WhatsApp' },
                { val: confirmIA, set: setConfirmIA, label: 'Lembrete automático H-2' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <button onClick={() => item.set(!item.val)} style={{ width: 40, height: 22, borderRadius: 11, background: item.val ? '#1a56db' : '#e2e8f0', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: item.val ? 21 : 3, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </button>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <button onClick={() => setSaved(true)} style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(26,86,219,0.35)' }}>
              <Icon d={icons.calendar} size={16} stroke='#fff' /> Confirmar agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
