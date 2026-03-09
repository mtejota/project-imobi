import { apiRequest } from '../lib/apiClient'

export function getDashboardMetrics(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/dashboard/metrics${query ? `?${query}` : ''}`)
}

export function getDailyPriorities() {
  return apiRequest('/dashboard/priorities')
}

export function getMetricsOverview(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/metrics/overview${query ? `?${query}` : ''}`)
}

export function getMetricsFunnel(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/metrics/funnel${query ? `?${query}` : ''}`)
}

export function getMetricsSources(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/metrics/sources${query ? `?${query}` : ''}`)
}

export function getMetricsBrokers(params = {}) {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/metrics/brokers${query ? `?${query}` : ''}`)
}
