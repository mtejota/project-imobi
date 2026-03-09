import { apiRequest } from '../lib/apiClient'

export function getProperties(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/properties${query ? `?${query}` : ''}`)
}

export function getPropertyById(id) {
  return apiRequest(`/properties/${id}`)
}

export function createProperty(body) {
  return apiRequest('/properties', { method: 'POST', body })
}

export function updateProperty(id, body) {
  return apiRequest(`/properties/${id}`, { method: 'PATCH', body })
}
