import StatCard from '../components/StatCard'

export default function ScreenMetrics() {
  const bars = [65, 80, 72, 90, 58, 85, 70, 95, 60, 88, 75, 92]
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  return (
    <div style={{ padding: '28px 32px', overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Sora', sans-serif" }}>Métricas & Performance</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Março 2026 · Atualizado em tempo real</div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <StatCard icon="trending" label="Taxa de Conversão" value="6.4%" delta={2} color="#10b981" bg="#f0fdf4" />
        <StatCard icon="clock" label="Tempo Médio de Resposta" value="4min" delta={-18} color="#3b82f6" bg="#eff6ff" />
        <StatCard icon="star" label="Satisfação do Cliente" value="4.8/5" delta={5} color="#f59e0b" bg="#fffbeb" />
        <StatCard icon="chart" label="Comissão Estimada" value="R$ 89k" delta={12} color="#8b5cf6" bg="#f5f3ff" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '22px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Negociações por Mês</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>2026 · meta: 80/mês</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Negociações', 'Fechamentos'].map((l, i) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: i === 0 ? '#1a56db' : '#10b981' }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: '70%', height: Math.floor(b * 0.35), background: '#dcfce7', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                  <div style={{ width: '100%', height: Math.floor(b * 1.5), borderRadius: '6px 6px 0 0', background: i === 2 ? '#1a56db' : '#dbeafe', transition: 'height 0.5s' }} />
                </div>
                <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Origem dos Leads</div>
            {[
              { label: 'WhatsApp Direto', pct: 38, color: '#10b981' },
              { label: 'ZAP / Viva Real', pct: 28, color: '#3b82f6' },
              { label: 'Indicações', pct: 21, color: '#8b5cf6' },
              { label: 'Site Próprio', pct: 9, color: '#f59e0b' },
              { label: 'Outros', pct: 4, color: '#94a3b8' },
            ].map((s) => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{s.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono', monospace" }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0f172a', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', marginBottom: 14 }}>Comissões 2026</div>
            {[
              { m: 'Jan', v: 'R$ 24k', pct: 80 },
              { m: 'Fev', v: 'R$ 31k', pct: 90 },
              { m: 'Mar (parcial)', v: 'R$ 18k', pct: 55 },
            ].map((r) => (
              <div key={r.m} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{r.m}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981', fontFamily: "'DM Mono', monospace" }}>{r.v}</span>
                </div>
                <div style={{ height: 5, background: '#1e293b', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: 'linear-gradient(90deg, #10b981, #22c55e)', borderRadius: 4 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: '12px', background: '#1e293b', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>Total acumulado 2026</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981', fontFamily: "'DM Mono', monospace" }}>R$ 73.000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
