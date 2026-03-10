const sleep = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

const LEADS = [
  { id: 1, name: 'Joao Ferreira', email: 'joao@email.com', phone: '(11) 98765-4321', source: 'WhatsApp IA', score: 92, tag: 'Quente', budget: 'R$ 750.000', propertyType: 'Apartamento 2 quartos', region: 'Pinheiros, Sao Paulo', stage: 'NEGOTIATION', color: '#ef4444', time: 'agora' },
  { id: 2, name: 'Beatriz Santos', email: 'beatriz@email.com', phone: '(11) 99811-2440', source: 'Portais', score: 84, tag: 'Quente', budget: 'R$ 820.000', propertyType: 'Apartamento 3 quartos', region: 'Perdizes, Sao Paulo', stage: 'PROPOSAL', color: '#8b5cf6', time: '8 min' },
  { id: 3, name: 'Rafael Mendes', email: 'rafael@email.com', phone: '(11) 97123-8854', source: 'Indicacao', score: 73, tag: 'Morno', budget: 'R$ 680.000', propertyType: 'Casa em condominio', region: 'Alphaville, Barueri', stage: 'VISIT', color: '#10b981', time: '15 min' },
  { id: 4, name: 'Camila Prado', email: 'camila@email.com', phone: '(11) 96352-1099', source: 'Instagram', score: 67, tag: 'Morno', budget: 'R$ 540.000', propertyType: 'Apartamento compacto', region: 'Vila Mariana, Sao Paulo', stage: 'PROSPECTING', color: '#3b82f6', time: '30 min' },
  { id: 5, name: 'Marina Costa', email: 'marina@email.com', phone: '(11) 98812-7713', source: 'WhatsApp IA', score: 81, tag: 'Quente', budget: 'R$ 1.150.000', propertyType: 'Cobertura', region: 'Moema, Sao Paulo', stage: 'CLOSING', color: '#14b8a6', time: '1h' },
  { id: 6, name: 'Lucas Prado', email: 'lucas@email.com', phone: '(11) 98111-3322', source: 'Site', score: 58, tag: 'Frio', budget: 'R$ 430.000', propertyType: 'Studio', region: 'Centro, Sao Paulo', stage: 'PROSPECTING', color: '#f59e0b', time: '2h' },
]

const PROPERTIES = [
  { id: 1, title: 'Apartamento 2Q - Pinheiros', price: 750000, totalArea: 78, bedrooms: 2, bathrooms: 2, status: 'Disponivel', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80' },
  { id: 2, title: 'Apartamento 3Q - Perdizes', price: 820000, totalArea: 95, bedrooms: 3, bathrooms: 2, status: 'Disponivel', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80' },
  { id: 3, title: 'Casa condominio - Alphaville', price: 1290000, totalArea: 210, bedrooms: 4, bathrooms: 4, status: 'Reservado', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80' },
  { id: 4, title: 'Studio moderno - Vila Mariana', price: 440000, totalArea: 36, bedrooms: 1, bathrooms: 1, status: 'Disponivel', img: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=900&q=80' },
]

const PIPELINE = [
  { id: 101, stage: 'Prospecção', name: 'Camila Prado', property: 'Studio - Vila Mariana', value: 'R$ 430.000', days: 2, color: '#3b82f6' },
  { id: 102, stage: 'Prospecção', name: 'Lucas Prado', property: 'Studio - Centro', value: 'R$ 410.000', days: 5, color: '#f59e0b' },
  { id: 103, stage: 'Visita', name: 'Rafael Mendes', property: 'Casa - Alphaville', value: 'R$ 1.290.000', days: 4, color: '#10b981' },
  { id: 104, stage: 'Proposta', name: 'Beatriz Santos', property: 'Apto - Perdizes', value: 'R$ 820.000', days: 7, color: '#8b5cf6' },
  { id: 105, stage: 'Negociação', name: 'Joao Ferreira', property: 'Apto - Pinheiros', value: 'R$ 750.000', days: 12, color: '#ef4444' },
  { id: 106, stage: 'Fechamento', name: 'Marina Costa', property: 'Cobertura - Moema', value: 'R$ 1.150.000', days: 3, color: '#14b8a6' },
]

const APPOINTMENTS = [
  { id: 1, time: '09:00', name: 'Joao Ferreira', property: 'Apto Pinheiros', type: 'Visita', status: 'confirmed', color: '#ef4444' },
  { id: 2, time: '11:00', name: 'Beatriz Santos', property: 'Apto Perdizes', type: 'Visita', status: 'pending', color: '#8b5cf6' },
  { id: 3, time: '14:00', name: 'Rafael Mendes', property: 'Casa Alphaville', type: 'Reuniao', status: 'pending', color: '#10b981' },
  { id: 4, time: '16:00', name: 'Marina Costa', property: 'Cobertura Moema', type: 'Visita', status: 'confirmed', color: '#14b8a6' },
]

const NOTIFICATIONS = [
  { id: 'n1', icon: 'zap', color: '#ef4444', bg: '#fef2f2', title: 'Lead quente detectado', desc: 'Joao Ferreira respondeu em menos de 1 minuto.' },
  { id: 'n2', icon: 'refresh', color: '#8b5cf6', bg: '#f5f3ff', title: 'Follow-up automatico enviado', desc: '3 leads frios receberam nova abordagem IA.' },
  { id: 'n3', icon: 'calendar', color: '#f59e0b', bg: '#fffbeb', title: 'Visita em 60 minutos', desc: 'Beatriz Santos - Apto Perdizes' },
  { id: 'n4', icon: 'file', color: '#3b82f6', bg: '#eff6ff', title: 'Documento recebido', desc: 'Marina enviou comprovante de renda.' },
].map((item, index) => ({
  ...item,
  createdAt: new Date(Date.now() - (index + 1) * 7 * 60 * 1000).toISOString(),
}))

const CONVERSATIONS = [
  {
    id: 1,
    name: 'Joao Ferreira',
    avatar: 'JF',
    color: '#ef4444',
    time: '09:18',
    unread: 2,
    hot: true,
    last: 'Consigo visitar hoje a tarde?',
    messages: [
      { from: 'bot', text: 'Oi, Joao. Separei duas opcoes em Pinheiros para voce.', time: '09:06' },
      { from: 'lead', text: 'Perfeito, quero ver ainda hoje.', time: '09:10' },
      { from: 'bot', text: 'Tenho horario as 16:00. Posso confirmar?', time: '09:12' },
    ],
  },
  {
    id: 2,
    name: 'Beatriz Santos',
    avatar: 'BS',
    color: '#8b5cf6',
    time: '08:51',
    unread: 1,
    hot: true,
    last: 'A proposta inclui vaga coberta?',
    messages: [
      { from: 'lead', text: 'A proposta inclui vaga coberta?', time: '08:51' },
      { from: 'bot', text: 'Sim, 1 vaga coberta e lazer completo.', time: '08:52' },
    ],
  },
  {
    id: 3,
    name: 'Rafael Mendes',
    avatar: 'RM',
    color: '#10b981',
    time: 'Ontem',
    unread: 0,
    hot: false,
    last: 'Obrigado, te retorno amanha.',
    messages: [
      { from: 'bot', text: 'Consegui uma condicao melhor para voce.', time: '17:28' },
      { from: 'lead', text: 'Obrigado, te retorno amanha.', time: '17:33' },
    ],
  },
]

const METRICS = {
  monthly: {
    leadsCaptured: 47,
    visits: 21,
    closings: 6,
    soldVolume: 5030000,
    commission: 150900,
    conversionRate: 18.4,
    conversionDelta: 4.2,
    avgResponseMinutes: 4.6,
    responseDelta: -1.5,
    satisfaction: 4.7,
    satisfactionDelta: 0.4,
    estimatedCommission: 184000,
    commissionDelta: 9.1,
    monthlyBars: [
      { month: 'Jan', value: 22 },
      { month: 'Fev', value: 36 },
      { month: 'Mar', value: 49 },
      { month: 'Abr', value: 54 },
      { month: 'Mai', value: 58 },
      { month: 'Jun', value: 63 },
      { month: 'Jul', value: 66 },
      { month: 'Ago', value: 61 },
      { month: 'Set', value: 68 },
      { month: 'Out', value: 73 },
      { month: 'Nov', value: 76 },
      { month: 'Dez', value: 81 },
    ],
    sources: [
      { label: 'WhatsApp IA', pct: 41, color: '#10b981' },
      { label: 'Portais', pct: 27, color: '#3b82f6' },
      { label: 'Instagram', pct: 18, color: '#8b5cf6' },
      { label: 'Indicacao', pct: 14, color: '#f59e0b' },
    ],
  },
}

const FUNNEL = [
  { stage: 'Leads captados', value: 47 },
  { stage: 'Qualificados', value: 30 },
  { stage: 'Visitas', value: 21 },
  { stage: 'Propostas', value: 9 },
  { stage: 'Fechamentos', value: 6 },
]

const BROKERS = [
  { id: 'b1', name: 'Lucas Correia', closings: 3, soldVolume: 1980000, commission: 59400 },
  { id: 'b2', name: 'Ana Paula', closings: 2, soldVolume: 1670000, commission: 50100 },
  { id: 'b3', name: 'Marcos Vieira', closings: 1, soldVolume: 1380000, commission: 41400 },
]

let activeUser = {
  id: 'usr-demo-1',
  name: 'Lucas Correia',
  email: 'lucas@zeety.com.br',
  creci: '123456-F',
  role: 'BROKER',
}

let whatsConnection = {
  connected: true,
  instanceId: 'evo-demo-01',
}

let reportCounter = 0
const reportStore = new Map()
let supportCounter = 3000

function periodKey(period) {
  const text = String(period || '').toLowerCase()
  if (!text || text.includes('marco') || text === 'monthly') return 'monthly'
  return 'monthly'
}

function tenantFromEmail(email) {
  const local = String(email || 'demo').split('@')[0] || 'demo'
  const slug =
    local
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'demo'
  return { id: `ten-${slug}`, slug, name: `Imobiliaria ${slug.replace(/-/g, ' ')}` }
}

export const authApi = {
  async registerTenantUser({ name, email, creci }) {
    await sleep(280)
    activeUser = {
      ...activeUser,
      name: name || activeUser.name,
      email: email || activeUser.email,
      creci: creci || activeUser.creci,
    }
    const tenant = tenantFromEmail(activeUser.email)
    return {
      accessToken: `demo-access-${Date.now()}`,
      refreshToken: `demo-refresh-${Date.now()}`,
      tenant,
      session: { ...activeUser, tenantId: tenant.id, tenantSlug: tenant.slug, tenantName: tenant.name },
    }
  },

  async loginTenantUser({ email }) {
    await sleep(220)
    if (email) activeUser = { ...activeUser, email }
    const tenant = tenantFromEmail(activeUser.email)
    return {
      accessToken: `demo-access-${Date.now()}`,
      refreshToken: `demo-refresh-${Date.now()}`,
      tenant,
      session: { ...activeUser, tenantId: tenant.id, tenantSlug: tenant.slug, tenantName: tenant.name },
    }
  },
}

export const leadsApi = {
  async getLeads() {
    await sleep()
    return { items: LEADS }
  },
}

export const propertiesApi = {
  async getProperties() {
    await sleep()
    return { items: PROPERTIES }
  },
}

export const pipelineApi = {
  async getPipelineCards() {
    await sleep()
    return { items: PIPELINE }
  },
}

export const appointmentsApi = {
  async getAppointments() {
    await sleep()
    return { items: APPOINTMENTS }
  },
}

export const notificationsApi = {
  async getNotifications() {
    await sleep()
    return { items: NOTIFICATIONS }
  },
}

export const whatsappApi = {
  async getConversations() {
    await sleep()
    return { items: CONVERSATIONS }
  },

  async getWhatsAppIntegrationStatus() {
    await sleep(150)
    return {
      connected: whatsConnection.connected,
      instanceId: whatsConnection.instanceId,
    }
  },

  async connectWhatsAppByQr() {
    await sleep(450)
    whatsConnection = {
      connected: true,
      instanceId: `evo-${Math.random().toString(36).slice(2, 8)}`,
    }
    return {
      ...whatsConnection,
      qrCode:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><rect width="220" height="220" fill="white"/><rect x="10" y="10" width="52" height="52" fill="black"/><rect x="158" y="10" width="52" height="52" fill="black"/><rect x="10" y="158" width="52" height="52" fill="black"/><rect x="86" y="86" width="48" height="48" fill="black"/></svg>',
    }
  },
}

export const metricsApi = {
  async getMetricsOverview({ period } = {}) {
    await sleep()
    return METRICS[periodKey(period)]
  },

  async getMetricsFunnel({ period } = {}) {
    await sleep()
    const key = periodKey(period)
    const ratio = Number((METRICS[key] || METRICS.monthly).leadsCaptured) / 47
    return { items: FUNNEL.map((item) => ({ ...item, value: Math.max(1, Math.round(item.value * ratio)) })) }
  },

  async getMetricsSources({ period } = {}) {
    await sleep()
    return { items: METRICS[periodKey(period)].sources }
  },

  async getMetricsBrokers({ period } = {}) {
    await sleep()
    const total = Number(METRICS[periodKey(period)].commission || 0)
    const ratio = total / 150900
    return { items: BROKERS.map((item) => ({ ...item, commission: Math.round(item.commission * ratio) })) }
  },
}

export const reportsApi = {
  async createReportExport(payload = {}) {
    await sleep(300)
    reportCounter += 1
    const id = `report-${reportCounter}`
    reportStore.set(id, { status: 'success', payload })
    return { id, reportId: id }
  },

  async getReportExportStatus(reportId) {
    await sleep(150)
    if (!reportStore.has(reportId)) return { status: 'error', errorMessage: 'Relatorio nao encontrado.' }
    return { status: 'success' }
  },

  async downloadReportPdf(reportId) {
    await sleep(180)
    if (!reportStore.has(reportId)) throw new Error('Relatorio nao encontrado.')
    const text = '%PDF-1.1\n1 0 obj <<>> endobj\ntrailer <<>>\n%%EOF'
    return new Blob([text], { type: 'application/pdf' })
  },
}

export const supportApi = {
  async createSupportTicket(payload = {}) {
    await sleep(260)
    supportCounter += 1
    return { id: `SUP-${supportCounter}`, status: 'open', ...payload }
  },

  async uploadSupportAttachment(ticketId, file) {
    await sleep(120)
    return { ticketId, fileName: file?.name || 'anexo.png', uploaded: true }
  },
}
