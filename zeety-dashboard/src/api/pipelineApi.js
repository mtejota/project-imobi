import { apiRequest } from '../lib/apiClient'

export function getPipelineCards(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/pipeline/cards${query ? `?${query}` : ''}`)
}

export function getPipelineCardById(id) {
  return apiRequest(`/pipeline/cards/${id}`)
}

export function createPipelineCard(body) {
  return apiRequest('/pipeline/cards', { method: 'POST', body })
}

export function updatePipelineCard(id, body) {
  return apiRequest(`/pipeline/cards/${id}`, { method: 'PATCH', body })
}

export function movePipelineCard(id, stage) {
  return apiRequest(`/pipeline/cards/${id}/stage`, { method: 'PATCH', body: { stage } })
}

export function deletePipelineCard(id) {
  return apiRequest(`/pipeline/cards/${id}`, { method: 'DELETE' })
}
