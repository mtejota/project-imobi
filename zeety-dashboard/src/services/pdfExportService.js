export function buildReportPayload({ period, sections, metrics }) {
  return {
    period,
    sections,
    metrics,
    generatedAt: new Date().toISOString(),
  }
}

export async function exportReportPdf(payload) {
  void payload
  throw new Error('PDF export service not implemented yet.')
}
