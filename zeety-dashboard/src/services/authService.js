import { authApi } from '../api'
import { setTokens } from './sessionService'

function mapSession(payload = {}) {
  const session = payload.session || payload.user || payload
  const tenant = payload.tenant || session.tenant || {}
  return {
    tenant: tenant.slug || session.tenantSlug || '',
    tenantId: tenant.id || session.tenantId || '',
    tenantName: tenant.name || session.tenantName || '',
    email: session.email || '',
    name: session.name || '',
    creci: session.creci || '',
    userId: session.id || session.userId || '',
    role: session.role || 'BROKER',
  }
}

export async function registerTenantUser({ name, email, password, creci }) {
  const payload = await authApi.registerTenantUser({ name, email, password, creci })
  setTokens({
    accessToken: payload.accessToken || payload.tokens?.accessToken,
    refreshToken: payload.refreshToken || payload.tokens?.refreshToken,
  })
  return { session: mapSession(payload) }
}

export async function loginTenantUser({ email, password }) {
  const payload = await authApi.loginTenantUser({ email, password })
  setTokens({
    accessToken: payload.accessToken || payload.tokens?.accessToken,
    refreshToken: payload.refreshToken || payload.tokens?.refreshToken,
  })
  return { session: mapSession(payload) }
}
