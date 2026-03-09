import { reportsApi } from '../api'

export function buildReportPayload({ period, sections, metrics }) {
  return {
    period,
    sections,
    metrics,
    generatedAt: new Date().toISOString(),
  }
}

export async function exportReportPdf(payload) {
  const job = await reportsApi.createReportExport(payload || {})
  const reportId = job.id || job.reportId
  if (!reportId) throw new Error('ID do relatório não retornado pelo backend.')

  const status = await reportsApi.getReportExportStatus(reportId)
  if (status.status && status.status !== 'success') {
    throw new Error(status.errorMessage || 'Falha ao gerar o PDF.')
  }

  const blob = await reportsApi.downloadReportPdf(reportId)
  const dateStamp = new Date().toISOString().slice(0, 10)
  const fileName = `relatorio-${dateStamp}.pdf`
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)

  return { ok: true, fileName }
}
