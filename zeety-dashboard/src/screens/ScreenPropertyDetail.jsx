import { useState } from 'react'
import Icon from '../components/Icon'
import { icons } from '../constants/icons'

const detailFallback = {
  id: 1,
  title: 'Apartamento 2 Quartos — Pinheiros',
  address: 'Rua dos Pinheiros, 1247, apto 82 — Pinheiros, São Paulo/SP',
  price: 'R$ 750.000',
  condo: 'R$ 1.200/mês',
  iptu: 'R$ 320/ano',
  area: '78 m²',
  privateArea: '65 m²',
  beds: 2,
  baths: 2,
  parking: 1,
  floor: 8,
  status: 'Disponível',
  code: 'ZTY-0847',
  type: 'Apartamento',
  age: '5 anos',
  sun: 'Manhã',
  furnishing: 'Semi-mobiliado',
  features: ['Varanda gourmet', 'Sacada', 'Academia', 'Piscina', 'Portaria 24h', 'Pet friendly', 'Salão de festas', 'Playground'],
  description:
    'Lindo apartamento em Pinheiros com excelente localização. Varanda gourmet integrada à sala, cozinha americana, dois quartos bem dimensionados sendo uma suíte completa. Prédio com infraestrutura completa de lazer.',
  imgs: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80',
  ],
}

const matchedLeads = [
  { name: 'João Ferreira', avatar: 'JF', color: '#ef4444', budget: 'R$ 750k', score: 98, tag: 'Quente' },
  { name: 'Beatriz Santos', avatar: 'BS', color: '#8b5cf6', budget: 'R$ 800k', score: 87, tag: 'Quente' },
  { name: 'Rafael Mendes', avatar: 'RM', color: '#10b981', budget: 'R$ 700k', score: 71, tag: 'Morno' },
]

const visits = [
  { name: 'João Ferreira', date: '08/03 · 10:00', status: 'confirmed', avatar: 'JF', color: '#ef4444' },
  { name: 'Beatriz Santos', date: '09/03 · 15:00', status: 'pending', avatar: 'BS', color: '#8b5cf6' },
]

export default function ScreenPropertyDetail({ property, onBack, onOpenEdit, onOpenScheduleVisit }) {
  const imovel = property
    ? {
        ...detailFallback,
        id: property.id,
        title: property.title,
        price: property.price,
        area: property.area?.replace('m²', ' m²') || detailFallback.area,
        beds: property.beds ?? detailFallback.beds,
        baths: property.baths ?? detailFallback.baths,
        status: property.status || detailFallback.status,
        imgs: property.img ? [property.img, ...detailFallback.imgs.slice(1)] : detailFallback.imgs,
      }
    : detailFallback

  const [photo, setPhoto] = useState(0)
  const [tab, setTab] = useState('info')
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [statusVal, setStatusVal] = useState(imovel.status)

  const statusOpts = ['Disponível', 'Reservado', 'Vendido', 'Inativo']
  const statusColor = { Disponível: '#10b981', Reservado: '#f59e0b', Vendido: '#3b82f6', Inativo: '#94a3b8' }
  const statusBg = { Disponível: '#f0fdf4', Reservado: '#fffbeb', Vendido: '#eff6ff', Inativo: '#f8fafc' }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
      {shareOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Compartilhar Imóvel</div>
              <button onClick={() => setShareOpen(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <Icon d={icons.x} size={14} />
              </button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, border: '1px solid #f1f5f9' }}>
              <Icon d={icons.link} size={14} stroke="#94a3b8" />
              <span style={{ flex: 1, fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>zeety.com.br/imovel/{imovel.code}</span>
              <button onClick={() => setCopied(true)} style={{ padding: '5px 10px', borderRadius: 8, border: 'none', background: copied ? '#10b981' : '#1a56db', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <button style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
              <Icon d={icons.whatsapp} size={15} stroke="#fff" /> Enviar via WhatsApp para todos
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          <Icon d={icons.back} size={15} /> Imóveis
        </button>
        <span style={{ color: '#e2e8f0' }}>›</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{imovel.code}</span>
        <span style={{ color: '#e2e8f0' }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{imovel.title}</span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={statusVal} onChange={(e) => setStatusVal(e.target.value)} style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${statusColor[statusVal]}40`, background: statusBg[statusVal], color: statusColor[statusVal], fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', appearance: 'none' }}>
            {statusOpts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={onOpenEdit} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 700, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
            <Icon d={icons.edit} size={13} /> Editar
          </button>
          <button onClick={() => setShareOpen(true)} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: '#1a56db', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
            <Icon d={icons.share} size={13} stroke="#fff" /> Compartilhar
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
        <div style={{ padding: '0 32px 28px' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative', background: '#000' }}>
            <img src={imovel.imgs[photo]} alt="" style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block', opacity: 0.95 }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 8 }}>
              {imovel.imgs.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setPhoto(i)} style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 10, cursor: 'pointer', border: `3px solid ${i === photo ? '#fff' : 'transparent'}`, opacity: i === photo ? 1 : 0.6 }} />
              ))}
            </div>
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
              <button style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.star} size={16} stroke="#f59e0b" />
              </button>
              <button style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={icons.maximize} size={16} stroke="#374151" />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{imovel.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                <Icon d={icons.mappin} size={14} stroke="#94a3b8" />
                {imovel.address}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#1a56db', fontFamily: "'DM Mono', monospace" }}>{imovel.price}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                Cond. {imovel.condo} · IPTU {imovel.iptu}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {[
              { icon: icons.layers, label: 'Área total', value: imovel.area },
              { icon: icons.home, label: 'Área privativa', value: imovel.privateArea },
              { icon: icons.user, label: 'Quartos', value: `${imovel.beds}Q / ${imovel.baths}B` },
              { icon: icons.layers, label: 'Vaga', value: `${imovel.parking} vaga` },
              { icon: icons.home, label: 'Andar', value: `${imovel.floor}º andar` },
              { icon: icons.calendar, label: 'Idade', value: imovel.age },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '14px 12px', border: '1px solid #f1f5f9', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                  <Icon d={icon} size={16} stroke="#94a3b8" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #f1f5f9', marginBottom: 24 }}>
            {[
              { id: 'info', label: 'Informações' },
              { id: 'features', label: 'Características' },
              { id: 'visits', label: 'Visitas Agendadas' },
              { id: 'matches', label: 'Leads Compatíveis' },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 800 : 500, color: tab === t.id ? '#1a56db' : '#64748b', borderBottom: `2px solid ${tab === t.id ? '#1a56db' : 'transparent'}`, marginBottom: -2, fontFamily: 'inherit' }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'info' && (
            <div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginBottom: 24 }}>{imovel.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Código do imóvel', value: imovel.code },
                  { label: 'Tipo', value: imovel.type },
                  { label: 'Insolação', value: imovel.sun },
                  { label: 'Mobília', value: imovel.furnishing },
                  { label: 'Condomínio', value: imovel.condo },
                  { label: 'IPTU', value: imovel.iptu },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'features' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {imovel.features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon d={icons.check} size={11} stroke="#10b981" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{f}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'visits' && (
            <div>
              {visits.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${v.color}20`, border: `2px solid ${v.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: v.color }}>{v.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{v.date}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: v.status === 'confirmed' ? '#f0fdf4' : '#fffbeb', color: v.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>{v.status === 'confirmed' ? 'Confirmado' : 'Pendente'}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'matches' && (
            <div>
              {matchedLeads.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${l.color}20`, border: `2px solid ${l.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: l.color }}>{l.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      Orçamento: {l.budget} · {l.tag}
                    </div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: l.score >= 90 ? '#10b981' : '#f59e0b', fontFamily: "'DM Mono', monospace" }}>{l.score}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderLeft: '1px solid #f1f5f9', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Ações Rápidas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: icons.whatsapp, label: 'Enviar a leads compatíveis', color: '#10b981', bg: '#f0fdf4' },
                  { icon: icons.calendar, label: 'Agendar visita', color: '#3b82f6', bg: '#eff6ff' },
                  { icon: icons.share, label: 'Gerar link de compartilhamento', color: '#8b5cf6', bg: '#f5f3ff' },
                ].map(({ icon, label, color, bg }) => (
                <button key={label} onClick={label === 'Agendar visita' ? onOpenScheduleVisit : undefined} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #f1f5f9', background: bg, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'left' }}>
                  <Icon d={icon} size={15} stroke={color} />
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
