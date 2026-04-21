import api from '../lib/axios'

export async function getDashboardStats() {
  const response = await api.get('/reports/dashboard')
  return response.data
}

export async function getAllReports(filters = {}) {
  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => String(value ?? '').trim() !== ''))
  const response = await api.get('/reports', { params })
  return response.data
}

export async function getReportById(reportId) {
  const response = await api.get(`/reports/${reportId}`)
  return response.data
}

export async function createReport(patientId, formData) {
  const response = await api.post(`/reports/${patientId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateReport(reportId, formData) {
  const response = await api.put(`/reports/${reportId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteReport(reportId) {
  const response = await api.delete(`/reports/${reportId}`)
  return response.data
}
