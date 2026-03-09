import { apiRequest } from '../lib/apiClient'

export function registerTenantUser(payload) {
  return apiRequest('/auth/register', { method: 'POST', body: payload, auth: false })
}

export function loginTenantUser(payload) {
  return apiRequest('/auth/login', { method: 'POST', body: payload, auth: false })
}

export function logoutTenantUser(payload = {}) {
  return apiRequest('/auth/logout', { method: 'POST', body: payload })
}

export function getMe() {
  return apiRequest('/me')
}
