export const leads = [
  { id: 1, name: 'João Ferreira', phone: '(11) 98765-4321', score: 92, tag: 'Quente', source: 'WhatsApp', budget: 'R$ 750k', type: 'Apartamento 2Q', region: 'Pinheiros', time: 'há 5 min', avatar: 'JF', color: '#ef4444' },
  { id: 2, name: 'Ana Rodrigues', phone: '(11) 91234-5678', score: 74, tag: 'Morno', source: 'ZAP', budget: 'R$ 450k', type: 'Casa 3Q', region: 'Tatuapé', time: 'há 23 min', avatar: 'AR', color: '#f59e0b' },
  { id: 3, name: 'Carlos Lima', phone: '(21) 99876-1234', score: 41, tag: 'Frio', source: 'Site', budget: 'R$ 300k', type: 'Studio', region: 'Centro', time: 'há 1h', avatar: 'CL', color: '#3b82f6' },
  { id: 4, name: 'Beatriz Santos', phone: '(11) 97654-3210', score: 88, tag: 'Quente', source: 'Indicação', budget: 'R$ 1.2M', type: 'Cobertura', region: 'Itaim Bibi', time: 'há 2h', avatar: 'BS', color: '#8b5cf6' },
  { id: 5, name: 'Rafael Mendes', phone: '(11) 95432-1098', score: 65, tag: 'Morno', source: 'WhatsApp', budget: 'R$ 600k', type: 'Apartamento 3Q', region: 'Vila Madalena', time: 'há 3h', avatar: 'RM', color: '#10b981' },
  { id: 6, name: 'Fernanda Costa', phone: '(11) 93210-9876', score: 55, tag: 'Morno', source: 'OLX', budget: 'R$ 380k', type: 'Apartamento 2Q', region: 'Mooca', time: 'há 5h', avatar: 'FC', color: '#06b6d4' },
]

export const pipeline = {
  'Prospecção': [
    { id: 1, name: 'Carlos Lima', property: 'Studio Centro', value: 'R$ 300k', days: 3, avatar: 'CL', color: '#3b82f6' },
    { id: 2, name: 'Fernanda Costa', property: 'Ap. 2Q Mooca', value: 'R$ 380k', days: 1, avatar: 'FC', color: '#06b6d4' },
  ],
  'Visita': [
    { id: 3, name: 'Ana Rodrigues', property: 'Casa 3Q Tatuapé', value: 'R$ 450k', days: 5, avatar: 'AR', color: '#f59e0b' },
    { id: 4, name: 'Rafael Mendes', property: 'Ap. 3Q V. Madalena', value: 'R$ 600k', days: 2, avatar: 'RM', color: '#10b981' },
  ],
  'Proposta': [
    { id: 5, name: 'Beatriz Santos', property: 'Cobertura Itaim', value: 'R$ 1.2M', days: 8, avatar: 'BS', color: '#8b5cf6' },
  ],
  'Negociação': [
    { id: 6, name: 'João Ferreira', property: 'Ap. 2Q Pinheiros', value: 'R$ 750k', days: 12, avatar: 'JF', color: '#ef4444' },
  ],
  'Fechamento': [
    { id: 7, name: 'Mariana Oliveira', property: 'Casa 4Q Morumbi', value: 'R$ 1.8M', days: 21, avatar: 'MO', color: '#ec4899' },
  ],
}

export const appointments = [
  { id: 1, time: '09:00', name: 'João Ferreira', property: 'Ap. 2Q - Pinheiros, 450m²', type: 'Visita', status: 'confirmed', avatar: 'JF', color: '#ef4444' },
  { id: 2, time: '11:00', name: 'Ana Rodrigues', property: 'Casa 3Q - Tatuapé', type: 'Visita', status: 'pending', avatar: 'AR', color: '#f59e0b' },
  { id: 3, time: '14:30', name: 'Beatriz Santos', property: 'Cobertura - Itaim Bibi', type: 'Reunião', status: 'confirmed', avatar: 'BS', color: '#8b5cf6' },
  { id: 4, time: '16:00', name: 'Rafael Mendes', property: 'Ap. 3Q - Vila Madalena', type: 'Visita', status: 'confirmed', avatar: 'RM', color: '#10b981' },
]

export const properties = [
  { id: 1, title: 'Ap. 2Q — Pinheiros', price: 'R$ 750.000', area: '78m²', beds: 2, baths: 2, status: 'Disponível', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80' },
  { id: 2, title: 'Casa 4Q — Morumbi', price: 'R$ 1.800.000', area: '320m²', beds: 4, baths: 3, status: 'Reservado', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
  { id: 3, title: 'Cobertura — Itaim', price: 'R$ 1.200.000', area: '145m²', beds: 3, baths: 2, status: 'Disponível', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80' },
  { id: 4, title: 'Studio — Centro', price: 'R$ 300.000', area: '38m²', beds: 1, baths: 1, status: 'Disponível', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80' },
]

export const messages = [
  { id: 1, name: 'João Ferreira', last: 'Posso ver o apartamento amanhã às 10h?', time: 'agora', unread: 2, hot: true, avatar: 'JF', color: '#ef4444' },
  { id: 2, name: 'Ana Rodrigues', last: 'Obrigada pelas fotos! Vou pensar 🙏', time: '5 min', unread: 0, hot: false, avatar: 'AR', color: '#f59e0b' },
  { id: 3, name: 'Beatriz Santos', last: 'Quero fazer a proposta. Como procedo?', time: '12 min', unread: 3, hot: true, avatar: 'BS', color: '#8b5cf6' },
  { id: 4, name: 'Carlos Lima', last: 'Tem algum studio com varanda?', time: '1h', unread: 1, hot: false, avatar: 'CL', color: '#3b82f6' },
  { id: 5, name: 'Rafael Mendes', last: 'Pode me enviar o contrato?', time: '2h', unread: 0, hot: false, avatar: 'RM', color: '#10b981' },
]

export const chatHistory = [
  { from: 'bot', text: 'Olá! Sou a assistente virtual da Imobiliária Zeety 👋 Como posso te ajudar hoje?', time: '10:00' },
  { from: 'user', text: 'Oi! Estou procurando um apartamento em Pinheiros', time: '10:01' },
  { from: 'bot', text: 'Que ótimo! Para te ajudar melhor: qual é o seu orçamento aproximado?', time: '10:01' },
  { from: 'user', text: 'Até R$ 800 mil', time: '10:02' },
  { from: 'bot', text: 'Perfeito! E quantos quartos você precisa? Tem preferência por garagem ou vaga?', time: '10:02' },
  { from: 'user', text: '2 quartos, com 1 vaga pelo menos', time: '10:03' },
  { from: 'bot', text: 'Entendido! 🏠 Tenho alguns imóveis que combinam com o seu perfil. Quando você tem disponibilidade para uma visita?', time: '10:03' },
  { from: 'user', text: 'Amanhã à tarde seria perfeito', time: '10:04' },
  { from: 'bot', text: 'Ótimo! Vou verificar a agenda do corretor. Um momento... ✅ Confirmado! Visita agendada para amanhã às 15h. Você receberá a confirmação por aqui.', time: '10:05' },
]

export const notifications = [
  { icon: 'zap', color: '#ef4444', bg: '#fef2f2', title: 'Lead Quente detectado!', desc: 'João Ferreira — intenção de compra alta. Orçamento: R$ 750k', time: 'há 2 min' },
  { icon: 'calendar', color: '#f59e0b', bg: '#fffbeb', title: 'Visita em 1 hora', desc: 'Ana Rodrigues — Casa 3Q Tatuapé às 11:00', time: 'há 10 min' },
  { icon: 'file', color: '#3b82f6', bg: '#eff6ff', title: 'Documento recebido', desc: 'Beatriz Santos enviou comprovante de renda', time: 'há 30 min' },
  { icon: 'refresh', color: '#8b5cf6', bg: '#f5f3ff', title: 'Follow-up automático', desc: 'Carlos Lima não responde há 48h — IA enviou mensagem', time: 'há 1h' },
]
