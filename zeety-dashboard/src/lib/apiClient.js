import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../services/sessionService'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'https://zeety-core-api-staging.up.railway.app'
).replace(/\/$/, '')

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return response.json()
  if (contentType.includes('application/pdf')) return response.blob()
  return response.text()
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    clearTokens()
    return false
  }

  const payload = await parseResponse(response)
  setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken })
  return true
}

export async function apiRequest(path, { method = 'GET', headers = {}, body, auth = true, retryAuth = true, isFormData = false } = {}) {
  const token = getAccessToken()
  const requestHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  }

  if (auth && token) requestHeaders.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body == null ? undefined : (isFormData ? body : JSON.stringify(body)),
  })

  if (response.status === 401 && auth && retryAuth) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiRequest(path, { method, headers, body, auth, retryAuth: false, isFormData })
    }
  }

  const payload = await parseResponse(response)
  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed (${response.status})`
    throw new ApiError(message, response.status, payload)
  }

  return payload
}
