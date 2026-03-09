import { apiRequest } from '../lib/apiClient'

export function createReportExport(body) {
  return apiRequest('/reports/export', { method: 'POST', body })
}

export function getReportExportStatus(id) {
  return apiRequest(`/reports/${id}/status`)
}

export function downloadReportPdf(id) {
  return apiRequest(`/reports/${id}/download`, { headers: { Accept: 'application/pdf' } })
}
