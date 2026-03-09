import { useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const TIMES = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
const DAYS_HEADER = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MARCH_OFFSET = 6
const BUSY_DAYS = [3, 5, 8, 10, 12, 15, 18, 20, 22]

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

  if (saved) {
    return (
      <div style={{ height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Icon d={icons.check} size={36} stroke="#10b981" strokeWidth={2.5} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Visita agendada!</div>
          <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 8 }}>
            <strong>{selectedLead?.name || 'Lead'}</strong> foi notificado via WhatsApp.
            <br />
            <span style={{ fontFamily: "'DM Mono', monospace", color: '#1a56db' }}>
              {selectedDay}/03 · {selectedTime}
            </span>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 8, textAlign: 'left' }}>
            <Icon d={icons.zap} size={14} stroke="#10b981" />
            <span style={{ fontSize: 12, color: '#16a34a' }}>IA enviou confirmação automática ao lead e criou lembrete para H-2.</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={() => setSaved(false)}
              style={{ padding: '10px 22px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              + Agendar outra
            </button>
            <button
              onClick={onBack}
              style={{ padding: '10px 22px', borderRadius: 12, border: 'none', background: '#1a56db', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Ver agenda →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 32px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
              <Icon d={icons.back} size={15} /> Agenda
            </button>
            <div style={{ height: 20, width: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Agendar Visita</span>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Tipo de Compromisso</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Visita', 'Reunião', 'Assinatura', 'Entrega de chaves'].map((t) => (
                <button key={t} onClick={() => setType(t)} style={{ padding: '9px 16px', borderRadius: 10, border: `2px solid ${type === t ? '#1a56db' : '#e2e8f0'}`, background: type === t ? '#eff6ff' : '#fff', color: type === t ? '#1a56db' : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Selecionar Data</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 13, color: '#64748b', fontFamily: 'inherit' }}>‹</button>
                <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Março 2026</span>
                <button style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 13, color: '#64748b', fontFamily: 'inherit' }}>›</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
              {DAYS_HEADER.map((d) => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', padding: '4px 0' }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array.from({ length: MARCH_OFFSET }).map((_, i) => (
                <div key={`e${i}`} />
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1
                const isSelected = day === selectedDay
                const isBusy = BUSY_DAYS.includes(day)
                const isPast = day < 8
                return (
                  <button
                    key={day}
                    onClick={() => !isPast && setSelectedDay(day)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? '#1a56db' : 'transparent'}`,
                      background: isSelected ? '#1a56db' : 'transparent',
                      color: isSelected ? '#fff' : isPast ? '#d1d5db' : '#374151',
                      fontSize: 12,
                      fontWeight: isSelected ? 800 : 500,
                      cursor: isPast ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      position: 'relative',
                      textAlign: 'center',
                    }}
                  >
                    {day}
                    {isBusy && !isSelected && <div style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} />}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              Horário — <span style={{ color: '#1a56db' }}>{selectedDay}/03/2026</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TIMES.map((t) => {
                const busy = ['09:00', '14:30'].includes(t)
                const sel = t === selectedTime
                return (
                  <button
                    key={t}
                    onClick={() => !busy && setSelectedTime(t)}
                    disabled={busy}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: `2px solid ${sel ? '#1a56db' : busy ? '#f1f5f9' : '#e2e8f0'}`,
                      background: sel ? '#1a56db' : busy ? '#f8fafc' : '#fff',
                      color: sel ? '#fff' : busy ? '#d1d5db' : '#374151',
                      fontSize: 12,
                      fontWeight: sel ? 800 : 500,
                      cursor: busy ? 'not-allowed' : 'pointer',
                      fontFamily: "'DM Mono', monospace",
                      textDecoration: busy ? 'line-through' : 'none',
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Observações</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruções especiais para o lead..."
              style={{ width: '100%', minHeight: 80, padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', color: '#374151', lineHeight: 1.6 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Lead</div>
            {leads.map((l) => (
              <div key={l.id} onClick={() => setSelectedLead(l)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, border: `2px solid ${selectedLead?.id === l.id ? '#1a56db' : '#f1f5f9'}`, background: selectedLead?.id === l.id ? '#eff6ff' : '#fff', cursor: 'pointer', marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${l.color}20`, border: `2px solid ${l.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: l.color }}>{l.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{l.name}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{l.phone}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Imóvel</div>
            {properties.map((p) => (
              <div key={p.id} onClick={() => setSelectedProperty(p)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, border: `2px solid ${selectedProperty?.id === p.id ? '#1a56db' : '#f1f5f9'}`, background: selectedProperty?.id === p.id ? '#eff6ff' : '#fff', cursor: 'pointer', marginBottom: 6 }}>
                <img src={p.img} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0f172a', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc', marginBottom: 14 }}>Resumo do Agendamento</div>
            {[
              { icon: icons.user, label: 'Lead', value: selectedLead?.name || '-' },
              { icon: icons.home, label: 'Imóvel', value: selectedProperty?.title || '-' },
              { icon: icons.calendar, label: 'Data', value: `${selectedDay}/03/2026` },
              { icon: icons.clock, label: 'Horário', value: selectedTime },
              { icon: icons.note, label: 'Tipo', value: type },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                <Icon d={icon} size={13} stroke="#64748b" />
                <span style={{ fontSize: 11, color: '#64748b', width: 60, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '16px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Automações</div>
            {[
              { val: sendReminder, set: setSendReminder, label: 'Enviar confirmação ao lead via WhatsApp' },
              { val: confirmIA, set: setConfirmIA, label: 'Lembrete automático H-2' },
            ].map(({ val, set, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <button onClick={() => set(!val)} style={{ width: 40, height: 22, borderRadius: 11, background: val ? '#1a56db' : '#e2e8f0', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: val ? 21 : 3, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </button>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setSaved(true)} style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #1a56db, #3b82f6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(26,86,219,0.4)' }}>
            <Icon d={icons.calendar} size={16} stroke="#fff" />
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  )
}
