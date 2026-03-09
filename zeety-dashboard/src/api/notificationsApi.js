import { apiRequest } from '../lib/apiClient'

export function getNotifications(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/notifications${query ? `?${query}` : ''}`)
}

export function markNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
}

export function clearNotifications() {
  return apiRequest('/notifications/clear', { method: 'POST' })
}
