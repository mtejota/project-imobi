import { useEffect, useMemo, useState } from 'react'

const PERIOD_CONFIG = {
  Dia: {
    subtitle: 'Março 2026 · 5 compromissos hoje',
    stats: [
      { label: 'Compromissos', value: 5, color: '#1a56db' },
      { label: 'Visitas', value: 3, color: '#10b981' },
      { label: 'Reuniões', value: 2, color: '#8b5cf6' },
    ],
    bars: [22, 36, 44, 52, 40, 31, 18],
    upcoming: [],
    schedule: {
      '09:00': [{ dayIndex: 2, name: 'João Ferreira', type: 'Visita', color: '#3b82f6' }],
      '11:00': [{ dayIndex: 2, name: 'Ana Rodrigues', type: 'Visita', color: '#f59e0b' }],
      '14:00': [{ dayIndex: 2, name: 'Beatriz Santos', type: 'Reunião', color: '#8b5cf6' }],
      '16:00': [{ dayIndex: 2, name: 'Rafael Mendes', type: 'Visita', color: '#10b981' }],
      '17:00': [{ dayIndex: 2, name: 'Carlos Lima', type: 'Reunião', color: '#ef4444' }],
    },
  },
  Semana: {
    subtitle: 'Março 2026 · 14 compromissos nesta semana',
    stats: [
      { label: 'Compromissos', value: 14, color: '#1a56db' },
      { label: 'Visitas', value: 9, color: '#10b981' },
      { label: 'Reuniões', value: 5, color: '#8b5cf6' },
    ],
    bars: [30, 42, 55, 67, 58, 45, 32],
    upcoming: [],
    schedule: {
      '09:00': [{ dayIndex: 1, name: 'João Ferreira', type: 'Visita', color: '#3b82f6' }],
      '10:00': [{ dayIndex: 4, name: 'Camila Prado', type: 'Reunião', color: '#8b5cf6' }],
      '11:00': [{ dayIndex: 2, name: 'Ana Rodrigues', type: 'Visita', color: '#f59e0b' }],
      '14:00': [{ dayIndex: 3, name: 'Beatriz Santos', type: 'Reunião', color: '#8b5cf6' }],
      '15:00': [{ dayIndex: 5, name: 'Rafael Mendes', type: 'Visita', color: '#10b981' }],
      '16:00': [{ dayIndex: 6, name: 'Marina Costa', type: 'Visita', color: '#ef4444' }],
    },
  },
  Mês: {
    subtitle: 'Março 2026 · 52 compromissos no mês',
    stats: [
      { label: 'Compromissos', value: 52, color: '#1a56db' },
      { label: 'Visitas', value: 34, color: '#10b981' },
      { label: 'Reuniões', value: 18, color: '#8b5cf6' },
    ],
    bars: [45, 52, 61, 77, 69, 58, 49],
    upcoming: [],
    schedule: {
      '09:00': [{ dayIndex: 0, name: 'Gabriel Matos', type: 'Visita', color: '#3b82f6' }],
      '11:00': [{ dayIndex: 2, name: 'Ana Rodrigues', type: 'Visita', color: '#f59e0b' }],
      '13:00': [{ dayIndex: 4, name: 'Clara Nunes', type: 'Reunião', color: '#8b5cf6' }],
      '14:00': [{ dayIndex: 1, name: 'Beatriz Santos', type: 'Reunião', color: '#8b5cf6' }],
      '16:00': [{ dayIndex: 5, name: 'Rafael Mendes', type: 'Visita', color: '#10b981' }],
      '17:00': [{ dayIndex: 6, name: 'Lucas Prado', type: 'Visita', color: '#ef4444' }],
    },
  },
}

export default function ScreenCalendar({ appointments = [], onOpenSchedule }) {
  const [view, setView] = useState('Semana')
  const [selectedDay, setSelectedDay] = useState(7)
  const [animate, setAnimate] = useState(true)
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  const config = PERIOD_CONFIG[view]
  const selectedWeekDayIndex = (selectedDay - 1) % 7

  const dayTemplates = useMemo(
    () => ({
      Dia: [
        { time: '09:00', name: 'João Ferreira', type: 'Visita', color: '#3b82f6' },
        { time: '11:00', name: 'Ana Rodrigues', type: 'Visita', color: '#f59e0b' },
        { time: '14:00', name: 'Beatriz Santos', type: 'Reunião', color: '#8b5cf6' },
        { time: '16:00', name: 'Rafael Mendes', type: 'Visita', color: '#10b981' },
        { time: '17:00', name: 'Carlos Lima', type: 'Reunião', color: '#ef4444' },
      ],
      Semana: [
        { time: '09:00', name: 'João Ferreira', type: 'Visita', color: '#3b82f6' },
        { time: '10:00', name: 'Camila Prado', type: 'Reunião', color: '#8b5cf6' },
        { time: '11:00', name: 'Ana Rodrigues', type: 'Visita', color: '#f59e0b' },
        { time: '14:00', name: 'Beatriz Santos', type: 'Reunião', color: '#8b5cf6' },
        { time: '15:00', name: 'Rafael Mendes', type: 'Visita', color: '#10b981' },
        { time: '16:00', name: 'Marina Costa', type: 'Visita', color: '#ef4444' },
      ],
      Mês: [
        { time: '09:00', name: 'Gabriel Matos', type: 'Visita', color: '#3b82f6' },
        { time: '11:00', name: 'Ana Rodrigues', type: 'Visita', color: '#f59e0b' },
        { time: '13:00', name: 'Clara Nunes', type: 'Reunião', color: '#8b5cf6' },
        { time: '14:00', name: 'Beatriz Santos', type: 'Reunião', color: '#8b5cf6' },
        { time: '16:00', name: 'Rafael Mendes', type: 'Visita', color: '#10b981' },
        { time: '17:00', name: 'Lucas Prado', type: 'Visita', color: '#ef4444' },
      ],
    }),
    []
  )

  const selectedDayEvents = useMemo(() => {
    return (dayTemplates[view] || []).map((event, index) => {
      const probability = event.probability ?? Math.max(42, 88 - index * 9)
      return {
        ...event,
        day: selectedDay,
        probability,
        property: appointments[index % appointments.length]?.property || 'Imóvel não informado',
      }
    })
  }, [dayTemplates, view, selectedDay])

  const prioritizedEvents = useMemo(() => {
    const toMinutes = (time) => {
      const [h, m] = String(time || '00:00').split(':').map(Number)
      return h * 60 + m
    }

    return [...selectedDayEvents].sort((a, b) => {
      if (b.probability !== a.probability) return b.probability - a.probability
      return toMinutes(a.time) - toMinutes(b.time)
    })
  }, [selectedDayEvents])

  const scheduleByHour = useMemo(() => {
    const map = {}
    prioritizedEvents.forEach((event) => {
      if (!map[event.time]) map[event.time] = []
      map[event.time].push({ ...event, dayIndex: selectedWeekDayIndex })
    })
    return map
  }, [prioritizedEvents, selectedWeekDayIndex])

  const periodStats = useMemo(() => {
    const total = prioritizedEvents.length
    const visitas = prioritizedEvents.filter((event) => event.type === 'Visita').length
    const reunioes = total - visitas
    return [
      { label: 'Compromissos', value: total, color: '#1a56db' },
      { label: 'Visitas', value: visitas, color: '#10b981' },
      { label: 'Reuniões', value: reunioes, color: '#8b5cf6' },
    ]
  }, [prioritizedEvents])

  const animatedBars = useMemo(() => {
    const base = view === 'Dia' ? 16 : view === 'Semana' ? 24 : 30
    return [0, 1, 2, 3, 4, 5, 6].map((i) => Math.min(92, base + ((selectedDay + i * 3) % 12) * 4))
  }, [view, selectedDay])

  useEffect(() => {
    setAnimate(false)
    const t = setTimeout(() => setAnimate(true), 40)
    return () => clearTimeout(t)
  }, [view, selectedDay])

  const summaryTotal = useMemo(
    () => periodStats.reduce((sum, item) => sum + item.value, 0),
    [periodStats]
  )

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Agenda</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{config.subtitle} · {selectedDay}/03</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Dia', 'Semana', 'Mês'].map((v) => {
            const active = v === view
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid',
                  borderColor: active ? '#1a56db' : '#e2e8f0',
                  background: active ? '#eff6ff' : '#fff',
                  color: active ? '#1a56db' : '#64748b',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {v}
              </button>
            )
          })}
          <button onClick={onOpenSchedule} style={{ background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Agendar</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, opacity: animate ? 1 : 0.65, transform: animate ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.25s ease' }}>
        <div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Março 2026</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12 }}>‹</button>
                <button style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12 }}>›</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
              {days.map((d) => <div key={d} style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', padding: '4px 0' }}>{d}</div>)}
              {[...Array(6)].map((_, i) => <div key={i} />)}
              {[...Array(31)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDay(i + 1)}
                  style={{
                    padding: '6px 4px',
                    fontSize: 11,
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: i + 1 === selectedDay ? '#1a56db' : 'transparent',
                    color: i + 1 === selectedDay ? '#fff' : [2, 5, 8, 12, 15, 18, 22, 25, 28].includes(i + 1) ? '#3b82f6' : '#374151',
                    fontWeight: i + 1 === selectedDay ? 800 : [2, 5, 8, 12, 15, 18, 22, 25, 28].includes(i + 1) ? 700 : 400,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f8fafc', fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Próximas visitas</div>
            {prioritizedEvents.map((a, i) => (
              <div key={`${a.time}-${a.name}-${i}`} style={{ padding: '12px 18px', borderBottom: i < prioritizedEvents.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 32, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{a.time} · {a.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{a.property} · prob. {a.probability}% · dia {selectedDay}/03</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Resumo do período</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>{summaryTotal} eventos</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
              {periodStats.map((item) => (
                <div key={item.label} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 10px', background: '#f8fafc' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: item.color, marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
              {animatedBars.map((bar, index) => (
                <div key={index} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: animate ? `${bar}%` : '8%', background: 'linear-gradient(180deg, #3b82f6, #1a56db)', borderRadius: '6px 6px 3px 3px', transition: `height 0.45s ease ${index * 35}ms` }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #f1f5f9' }}>
              <div />
              {days.map((d, i) => (
                <div key={d} style={{ padding: '12px 8px', textAlign: 'center', borderLeft: '1px solid #f8fafc' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{d}</div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '4px auto 0', background: i === 6 ? '#1a56db' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: i === 6 ? 800 : 600, color: i === 6 ? '#fff' : '#0f172a' }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 420 }}>
              {hours.map((h) => (
                <div key={h} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ padding: '8px 10px', fontSize: 10, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>{h}</div>
                  {[...Array(7)].map((_, dayIndex) => {
                    const items = (scheduleByHour[h] || []).filter((item) => item.dayIndex === dayIndex)
                    return (
                      <div key={dayIndex} style={{ minHeight: 40, borderLeft: '1px solid #f8fafc', padding: 3 }}>
                        {items.map((item, idx) => (
                          <div key={`${item.name}-${idx}`} style={{ background: `${item.color}18`, borderLeft: `3px solid ${item.color}`, borderRadius: 6, padding: '4px 8px', height: '100%', marginBottom: 3 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.name}</div>
                            <div style={{ fontSize: 9, color: '#94a3b8' }}>{item.type}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
