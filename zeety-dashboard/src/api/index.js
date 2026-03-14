import * as authModule from './authApi'
import * as leadsModule from './leadsApi'
import * as metricsModule from './metricsApi'
import * as notificationsModule from './notificationsApi'
import * as pipelineModule from './pipelineApi'
import * as propertiesModule from './propertiesApi'
import * as reportsModule from './reportsApi'
import * as supportModule from './supportApi'
import * as whatsappModule from './whatsappApi'
import * as appointmentsModule from './appointmentsApi'

export const authApi = {
  registerTenantUser: authModule.registerTenantUser,
  loginTenantUser: authModule.loginTenantUser,
  logoutTenantUser: authModule.logoutTenantUser,
  getMe: authModule.getMe,
}

export const leadsApi = {
  getLeads: leadsModule.getLeads,
  getLeadById: leadsModule.getLeadById,
  createLead: leadsModule.createLead,
  updateLead: leadsModule.updateLead,
}

export const propertiesApi = {
  getProperties: propertiesModule.getProperties,
  getPropertyById: propertiesModule.getPropertyById,
  createProperty: propertiesModule.createProperty,
  updateProperty: propertiesModule.updateProperty,
}

export const pipelineApi = {
  getPipelineCards: pipelineModule.getPipelineCards,
  getPipelineCardById: pipelineModule.getPipelineCardById,
  createPipelineCard: pipelineModule.createPipelineCard,
  updatePipelineCard: pipelineModule.updatePipelineCard,
  movePipelineCard: pipelineModule.movePipelineCard,
  deletePipelineCard: pipelineModule.deletePipelineCard,
}

export const appointmentsApi = {
  getAppointments: appointmentsModule.getAppointments,
  createAppointment: appointmentsModule.createAppointment,
  updateAppointment: appointmentsModule.updateAppointment,
}

export const notificationsApi = {
  getNotifications: notificationsModule.getNotifications,
  markNotificationRead: notificationsModule.markNotificationRead,
  clearNotifications: notificationsModule.clearNotifications,
}

export const metricsApi = {
  getDashboardMetrics: metricsModule.getDashboardMetrics,
  getDailyPriorities: metricsModule.getDailyPriorities,
  getMetricsOverview: metricsModule.getMetricsOverview,
  getMetricsFunnel: metricsModule.getMetricsFunnel,
  getMetricsSources: metricsModule.getMetricsSources,
  getMetricsBrokers: metricsModule.getMetricsBrokers,
}

export const reportsApi = {
  createReportExport: reportsModule.createReportExport,
  getReportExportStatus: reportsModule.getReportExportStatus,
  downloadReportPdf: reportsModule.downloadReportPdf,
}

export const supportApi = {
  createSupportTicket: supportModule.createSupportTicket,
  uploadSupportAttachment: supportModule.uploadSupportAttachment,
}

export const whatsappApi = {
  getWhatsAppIntegrationStatus: whatsappModule.getWhatsAppIntegrationStatus,
  connectWhatsAppByQr: whatsappModule.connectWhatsAppByQr,
  connectWhatsAppCloud: whatsappModule.connectWhatsAppCloud,
  disconnectWhatsApp: whatsappModule.disconnectWhatsApp,
  getConversations: whatsappModule.getConversations,
  getConversationMessages: whatsappModule.getConversationMessages,
  sendConversationMessage: whatsappModule.sendConversationMessage,
}
