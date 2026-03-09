import { apiRequest } from '../lib/apiClient'

export function createSupportTicket(body) {
  return apiRequest('/support/tickets', { method: 'POST', body })
}

export function uploadSupportAttachment(ticketId, file) {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest(`/support/tickets/${ticketId}/attachments`, {
    method: 'POST',
    body: formData,
    isFormData: true,
  })
}
