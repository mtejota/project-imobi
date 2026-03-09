import { apiRequest } from '../lib/apiClient'

export function getAppointments(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/appointments${query ? `?${query}` : ''}`)
}

export function createAppointment(body) {
  return apiRequest('/appointments', { method: 'POST', body })
}

export function updateAppointment(id, body) {
  return apiRequest(`/appointments/${id}`, { method: 'PATCH', body })
}
