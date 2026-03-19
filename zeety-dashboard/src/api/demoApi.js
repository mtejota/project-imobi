const sleep = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms))
const DEMO_LOGIN_EMAIL = 'demo@zeety.com.br'
const DEMO_LOGIN_PASSWORD = 'Demo@123'

const DEMO_LEADS = [
  { id: 1, name: 'Marcos Andrade', email: 'marcos@demo.com', phone: '(11) 99871-2201', source: 'Instagram', score: 94, tag: 'Quente', budget: 'R$ 980.000', propertyType: 'Apartamento 3 quartos', region: 'Pinheiros, São Paulo', stage: 'NEGOTIATION', color: '#ef4444', time: 'agora' },
  { id: 2, name: 'Fernanda Costa', email: 'fernanda@demo.com', phone: '(11) 99763-1884', source: 'Indicação', score: 88, tag: 'Quente', budget: 'R$ 1.350.000', propertyType: 'Cobertura', region: 'Moema, São Paulo', stage: 'PROPOSAL', color: '#8b5cf6', time: '6 min' },
  { id: 3, name: 'Renato Lima', email: 'renato@demo.com', phone: '(11) 99641-2090', source: 'Tráfego Pago', score: 76, tag: 'Morno', budget: 'R$ 720.000', propertyType: 'Casa em condomínio', region: 'Alphaville, Barueri', stage: 'VISIT', color: '#10b981', time: '17 min' },
  { id: 4, name: 'Camila Torres', email: 'camila@demo.com', phone: '(11) 99115-4452', source: 'Site', score: 69, tag: 'Morno', budget: 'R$ 640.000', propertyType: 'Apartamento 2 quartos', region: 'Vila Mariana, São Paulo', stage: 'PROSPECTING', color: '#3b82f6', time: '31 min' },
  { id: 5, name: 'Bruno Nogueira', email: 'bruno@demo.com', phone: '(11) 99388-5104', source: 'Meta Ads', score: 83, tag: 'Quente', budget: 'R$ 1.820.000', propertyType: 'Casa alto padrão', region: 'Santana de Parnaíba', stage: 'CLOSING', color: '#14b8a6', time: '52 min' },
  { id: 6, name: 'Julia Azevedo', email: 'julia@demo.com', phone: '(11) 99902-3005', source: 'Google', score: 62, tag: 'Frio', budget: 'R$ 540.000', propertyType: 'Studio', region: 'Consolação, São Paulo', stage: 'PROSPECTING', color: '#f59e0b', time: '1h' },
]

const DEMO_PROPERTIES = [
  { id: 1, title: 'Apartamento 3Q - Pinheiros', price: 980000, totalArea: 96, bedrooms: 3, bathrooms: 2, status: 'Disponível', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80' },
  { id: 2, title: 'Cobertura - Moema', price: 1350000, totalArea: 144, bedrooms: 3, bathrooms: 3, status: 'Disponível', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80' },
  { id: 3, title: 'Casa condomínio - Alphaville', price: 1820000, totalArea: 240, bedrooms: 4, bathrooms: 4, status: 'Reservado', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80' },
  { id: 4, title: 'Apartamento 2Q - Vila Mariana', price: 640000, totalArea: 74, bedrooms: 2, bathrooms: 2, status: 'Disponível', img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80' },
  { id: 5, title: 'Studio - Consolação', price: 540000, totalArea: 39, bedrooms: 1, bathrooms: 1, status: 'Disponível', img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80' },
]

const DEMO_PIPELINE = [
  { id: 101, stage: 'Prospecção', name: 'Camila Torres', property: 'Apartamento 2Q - Vila Mariana', value: 'R$ 640.000', days: 2, color: '#3b82f6' },
  { id: 102, stage: 'Prospecção', name: 'Julia Azevedo', property: 'Studio - Consolação', value: 'R$ 540.000', days: 4, color: '#f59e0b' },
  { id: 103, stage: 'Visita', name: 'Renato Lima', property: 'Casa condomínio - Alphaville', value: 'R$ 1.820.000', days: 3, color: '#10b981' },
  { id: 104, stage: 'Proposta', name: 'Fernanda Costa', property: 'Cobertura - Moema', value: 'R$ 1.350.000', days: 5, color: '#8b5cf6' },
  { id: 105, stage: 'Negociação', name: 'Marcos Andrade', property: 'Apartamento 3Q - Pinheiros', value: 'R$ 980.000', days: 7, color: '#ef4444' },
  { id: 106, stage: 'Fechamento', name: 'Bruno Nogueira', property: 'Casa condomínio - Alphaville', value: 'R$ 1.820.000', days: 1, color: '#14b8a6' },
]

const DEMO_APPOINTMENTS = [
  { id: 1, time: '09:00', name: 'Marcos Andrade', property: 'Apartamento 3Q - Pinheiros', type: 'Visita', status: 'confirmed', color: '#ef4444' },
  { id: 2, time: '11:30', name: 'Fernanda Costa', property: 'Cobertura - Moema', type: 'Reunião', status: 'pending', color: '#8b5cf6' },
  { id: 3, time: '14:00', name: 'Renato Lima', property: 'Casa condomínio - Alphaville', type: 'Visita', status: 'pending', color: '#10b981' },
  { id: 4, time: '16:00', name: 'Bruno Nogueira', property: 'Casa condomínio - Alphaville', type: 'Proposta', status: 'confirmed', color: '#14b8a6' },
]

const DEMO_NOTIFICATIONS = [
  { id: 'n1', icon: 'zap', color: '#ef4444', bg: '#fef2f2', title: 'Lead quente detectado', desc: 'Marcos Andrade respondeu em menos de 2 minutos.' },
  { id: 'n2', icon: 'calendar', color: '#f59e0b', bg: '#fffbeb', title: 'Visita confirmada', desc: 'Renato Lima confirmou a visita das 14:00.' },
  { id: 'n3', icon: 'file', color: '#3b82f6', bg: '#eff6ff', title: 'Documento recebido', desc: 'Fernanda enviou a documentação para proposta.' },
  { id: 'n4', icon: 'refresh', color: '#8b5cf6', bg: '#f5f3ff', title: 'Follow-up automático', desc: 'A IA reativou 3 leads sem resposta nas últimas 24h.' },
].map((item, index) => ({
  ...item,
  createdAt: new Date(Date.now() - (index + 1) * 11 * 60 * 1000).toISOString(),
}))

const METRICS_BY_PERIOD = {
  weekly: {
    leadsCaptured: 18,
    visits: 9,
    closings: 2,
    soldVolume: 1780000,
    commission: 53400,
    conversionRate: 22.8,
    conversionDelta: 6.4,
    avgResponseMinutes: 3.2,
    responseDelta: -1.1,
    satisfaction: 4.8,
    satisfactionDelta: 0.5,
    estimatedCommission: 72800,
    commissionDelta: 10.2,
    monthlyBars: [
      { month: 'Seg', value: 22 },
      { month: 'Ter', value: 36 },
      { month: 'Qua', value: 44 },
      { month: 'Qui', value: 53 },
      { month: 'Sex', value: 61 },
      { month: 'Sab', value: 47 },
      { month: 'Dom', value: 39 },
    ],
    sources: [
      { label: 'Instagram', pct: 31, color: '#10b981' },
      { label: 'Indicação', pct: 26, color: '#3b82f6' },
      { label: 'Google', pct: 24, color: '#8b5cf6' },
      { label: 'Site', pct: 19, color: '#f59e0b' },
    ],
    funnel: [
      { stage: 'Leads captados', value: 18 },
      { stage: 'Qualificados', value: 11 },
      { stage: 'Visitas', value: 9 },
      { stage: 'Propostas', value: 4 },
      { stage: 'Fechamentos', value: 2 },
    ],
    brokers: [
      { id: 'b1', name: 'Lucas Correia', closings: 1, soldVolume: 980000, commission: 29400 },
      { id: 'b2', name: 'Ana Paula', closings: 1, soldVolume: 800000, commission: 24000 },
    ],
  },
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
      { label: 'Instagram', pct: 29, color: '#10b981' },
      { label: 'Indicação', pct: 24, color: '#3b82f6' },
      { label: 'Google', pct: 21, color: '#8b5cf6' },
      { label: 'Site', pct: 14, color: '#f59e0b' },
      { label: 'Portais', pct: 12, color: '#14b8a6' },
    ],
    funnel: [
      { stage: 'Leads captados', value: 47 },
      { stage: 'Qualificados', value: 30 },
      { stage: 'Visitas', value: 21 },
      { stage: 'Propostas', value: 9 },
      { stage: 'Fechamentos', value: 6 },
    ],
    brokers: [
      { id: 'b1', name: 'Lucas Correia', closings: 3, soldVolume: 1980000, commission: 59400 },
      { id: 'b2', name: 'Ana Paula', closings: 2, soldVolume: 1670000, commission: 50100 },
      { id: 'b3', name: 'Marcos Vieira', closings: 1, soldVolume: 1380000, commission: 41400 },
    ],
  },
  quarterly: {
    leadsCaptured: 126,
    visits: 58,
    closings: 14,
    soldVolume: 12800000,
    commission: 384000,
    conversionRate: 21.3,
    conversionDelta: 7.8,
    avgResponseMinutes: 4.1,
    responseDelta: -2.2,
    satisfaction: 4.9,
    satisfactionDelta: 0.6,
    estimatedCommission: 412000,
    commissionDelta: 11.4,
    monthlyBars: [
      { month: 'Jan', value: 48 },
      { month: 'Fev', value: 59 },
      { month: 'Mar', value: 68 },
      { month: 'Abr', value: 71 },
      { month: 'Mai', value: 79 },
      { month: 'Jun', value: 84 },
      { month: 'Jul', value: 91 },
      { month: 'Ago', value: 88 },
      { month: 'Set', value: 95 },
      { month: 'Out', value: 103 },
      { month: 'Nov', value: 108 },
      { month: 'Dez', value: 116 },
    ],
    sources: [
      { label: 'Instagram', pct: 27, color: '#10b981' },
      { label: 'Indicação', pct: 25, color: '#3b82f6' },
      { label: 'Google', pct: 22, color: '#8b5cf6' },
      { label: 'Site', pct: 14, color: '#f59e0b' },
      { label: 'Portais', pct: 12, color: '#14b8a6' },
    ],
    funnel: [
      { stage: 'Leads captados', value: 126 },
      { stage: 'Qualificados', value: 82 },
      { stage: 'Visitas', value: 58 },
      { stage: 'Propostas', value: 26 },
      { stage: 'Fechamentos', value: 14 },
    ],
    brokers: [
      { id: 'b1', name: 'Lucas Correia', closings: 6, soldVolume: 4780000, commission: 143400 },
      { id: 'b2', name: 'Ana Paula', closings: 5, soldVolume: 4110000, commission: 123300 },
      { id: 'b3', name: 'Marcos Vieira', closings: 3, soldVolume: 3910000, commission: 117300 },
    ],
  },
}

let activeUser = {
  id: 'usr-demo-1',
  name: 'Lucas Correia',
  email: 'demo@zeety.com.br',
  creci: '123456-F',
  role: 'BROKER',
}

let whatsappConnection = {
  connected: true,
  instanceId: 'evo-demo-room-01',
  qrCode: '',
}

let reportCounter = 200
let supportCounter = 4100

function periodKey(period) {
  const value = String(period || '').toLowerCase()
  if (value.includes('week') || value.includes('seman')) return 'weekly'
  if (value.includes('quarter') || value.includes('trimes')) return 'quarterly'
  return 'monthly'
}

function tenantFromEmail(email) {
  const local = String(email || 'demo').split('@')[0] || 'demo'
  const slug =
    local
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'demo'

  return {
    id: `ten-${slug}`,
    slug,
    name: `Zeety ${slug.replace(/-/g, ' ')}`,
  }
}

export const authApi = {
  async registerTenantUser({ name, email, creci }) {
    await sleep(240)
    const inputEmail = String(email || '').trim().toLowerCase()
    if (inputEmail !== DEMO_LOGIN_EMAIL) {
      throw new Error(`Para a demo, use o e-mail ${DEMO_LOGIN_EMAIL}.`)
    }
    activeUser = {
      ...activeUser,
      name: name || activeUser.name,
      email: inputEmail || activeUser.email,
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

  async loginTenantUser({ email, password }) {
    await sleep(180)
    const inputEmail = String(email || '').trim().toLowerCase()
    const inputPassword = String(password || '')
    if (inputEmail !== DEMO_LOGIN_EMAIL || inputPassword !== DEMO_LOGIN_PASSWORD) {
      throw new Error('Credenciais invalidas para a demo.')
    }
    activeUser = {
      ...activeUser,
      email: inputEmail,
    }
    const tenant = tenantFromEmail(activeUser.email)
    return {
      accessToken: `demo-access-${Date.now()}`,
      refreshToken: `demo-refresh-${Date.now()}`,
      tenant,
      session: { ...activeUser, tenantId: tenant.id, tenantSlug: tenant.slug, tenantName: tenant.name },
    }
  },

  async logoutTenantUser() {
    await sleep(80)
    return { ok: true }
  },

  async getMe() {
    await sleep(80)
    return activeUser
  },
}

export const leadsApi = {
  async getLeads() {
    await sleep()
    return { items: DEMO_LEADS }
  },
}

export const propertiesApi = {
  async getProperties() {
    await sleep()
    return { items: DEMO_PROPERTIES }
  },
}

export const pipelineApi = {
  async getPipelineCards() {
    await sleep()
    return { items: DEMO_PIPELINE }
  },
}

export const appointmentsApi = {
  async getAppointments() {
    await sleep()
    return { items: DEMO_APPOINTMENTS }
  },
}

export const notificationsApi = {
  async getNotifications() {
    await sleep()
    return { items: DEMO_NOTIFICATIONS }
  },

  async markNotificationRead(id) {
    await sleep(60)
    return { ok: true, id }
  },

  async clearNotifications() {
    await sleep(60)
    return { ok: true }
  },
}

export const metricsApi = {
  async getDashboardMetrics(params = {}) {
    await sleep()
    return METRICS_BY_PERIOD[periodKey(params.period)]
  },

  async getDailyPriorities() {
    await sleep()
    return {
      items: [
        { id: 1, title: 'Retomar Marcos Andrade', desc: 'Lead quente com retorno imediato', score: 96 },
        { id: 2, title: 'Confirmar visita de Renato Lima', desc: 'Visita prevista para hoje às 14h', score: 88 },
        { id: 3, title: 'Enviar proposta final para Fernanda', desc: 'Negociação avançada em Moema', score: 84 },
      ],
    }
  },

  async getMetricsOverview(params = {}) {
    await sleep()
    return METRICS_BY_PERIOD[periodKey(params.period)]
  },

  async getMetricsFunnel(params = {}) {
    await sleep()
    return { items: METRICS_BY_PERIOD[periodKey(params.period)].funnel }
  },

  async getMetricsSources(params = {}) {
    await sleep()
    return { items: METRICS_BY_PERIOD[periodKey(params.period)].sources }
  },

  async getMetricsBrokers(params = {}) {
    await sleep()
    return { items: METRICS_BY_PERIOD[periodKey(params.period)].brokers }
  },
}

export const reportsApi = {
  async createReportExport() {
    await sleep(220)
    reportCounter += 1
    return { id: `report-${reportCounter}` }
  },

  async getReportExportStatus(id) {
    await sleep(100)
    return { id, status: 'success' }
  },

  async downloadReportPdf(id) {
    await sleep(120)
    return new Blob([`Relatorio demo ${id}`], { type: 'application/pdf' })
  },
}

export const supportApi = {
  async createSupportTicket(body) {
    await sleep(180)
    supportCounter += 1
    return {
      id: `SUP-${supportCounter}`,
      ...body,
      status: 'open',
    }
  },

  async uploadSupportAttachment(ticketId, file) {
    await sleep(120)
    return {
      ticketId,
      fileName: file?.name || 'arquivo-demo',
      ok: true,
    }
  },
}

export const whatsappApi = {
  async getWhatsAppIntegrationStatus() {
    await sleep(80)
    return {
      connected: whatsappConnection.connected,
      instanceId: whatsappConnection.instanceId,
      qrCode: whatsappConnection.qrCode,
    }
  },

  async connectWhatsAppByQr() {
    await sleep(160)
    whatsappConnection = {
      connected: true,
      instanceId: `evo-demo-${Math.random().toString(36).slice(2, 8)}`,
      qrCode: '',
    }
    return whatsappConnection
  },

  async connectWhatsAppCloud(body = {}) {
    await sleep(160)
    whatsappConnection = {
      connected: true,
      instanceId: body.instanceId || `evo-demo-${Math.random().toString(36).slice(2, 8)}`,
      qrCode: '',
    }
    return whatsappConnection
  },

  async disconnectWhatsApp() {
    await sleep(100)
    whatsappConnection = {
      connected: false,
      instanceId: '',
      qrCode: '',
    }
    return { ok: true }
  },

  async getConversations() {
    await sleep(100)
    return { items: [] }
  },

  async getConversationMessages() {
    await sleep(80)
    return { items: [] }
  },

  async sendConversationMessage() {
    await sleep(80)
    return { ok: true }
  },
}
