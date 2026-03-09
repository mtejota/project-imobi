import { apiRequest } from '../lib/apiClient'

export function getLeads(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/leads${query ? `?${query}` : ''}`)
}

export function getLeadById(id) {
  return apiRequest(`/leads/${id}`)
}

export function createLead(body) {
  return apiRequest('/leads', { method: 'POST', body })
}

export function updateLead(id, body) {
  return apiRequest(`/leads/${id}`, { method: 'PATCH', body })
}
