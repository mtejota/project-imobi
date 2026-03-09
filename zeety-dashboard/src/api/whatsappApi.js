import { apiRequest } from '../lib/apiClient'

export function getWhatsAppIntegrationStatus() {
  return apiRequest('/integrations/whatsapp/status')
}

export function connectWhatsAppByQr() {
  return apiRequest('/integrations/whatsapp/connect', { method: 'POST', body: { method: 'qrcode' } })
}

export function connectWhatsAppCloud(body) {
  return apiRequest('/integrations/whatsapp/connect', { method: 'POST', body: { method: 'official', ...body } })
}

export function disconnectWhatsApp() {
  return apiRequest('/integrations/whatsapp/disconnect', { method: 'POST' })
}

export function getConversations(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/whatsapp/conversations${query ? `?${query}` : ''}`)
}

export function getConversationMessages(conversationId, params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/whatsapp/conversations/${conversationId}/messages${query ? `?${query}` : ''}`)
}

export function sendConversationMessage(conversationId, body) {
  return apiRequest(`/whatsapp/conversations/${conversationId}/messages`, { method: 'POST', body })
}
