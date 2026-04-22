import { CheckCircle2, X, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { createReport, updateReport } from '../../api/reports'
import ReportForm from './ReportForm'

function toFormDate(value) {
  if (!value) return ''
  return new Date(value).toISOString().split('T')[0]
}

function ReportModal({ isOpen, onClose, onSuccess, patientId, report }) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setErrorMessage('')
      setTimeout(() => setIsVisible(true), 10)
      return
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setShouldRender(false), 200)
    return () => clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    if (!shouldRender) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, shouldRender])

  useEffect(() => {
    if (!shouldRender) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [shouldRender])

  const initialValues = useMemo(() => {
    if (!report) return undefined
    return {
      report_type: report.report_type || '',
      report_date: toFormDate(report.report_date),
      result_value: report.result_value ?? '',
      unit: report.unit || '',
      reference_min: report.reference_min ?? '',
      reference_max: report.reference_max ?? '',
    }
  }, [report])

  const handleSubmit = async (formValues) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('report_type', formValues.report_type)
      formData.append('report_date', String(formValues.report_date))
      formData.append('result_value', String(formValues.result_value))
      formData.append('unit', formValues.unit)
      formData.append('reference_min', String(formValues.reference_min))
      formData.append('reference_max', String(formValues.reference_max))
      if (formValues.file) {
        formData.append('file', formValues.file)
      }

      if (report) {
        await updateReport(report.id, formData)
      } else {
        await createReport(patientId, formData)
      }

      setShowToast(true)
      onSuccess()
      setTimeout(() => {
        setShowToast(false)
        onClose()
      }, 1000)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save report')
    } finally {
      setIsLoading(false)
    }
  }

  if (!shouldRender) return null

  const isEditMode = Boolean(report)

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/30 backdrop-blur-md"
        aria-label="Close modal"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className={`animate-scaleIn relative w-full max-w-2xl rounded-2xl border border-white/50 bg-surface p-6 shadow-dropdown transition-all duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-h-[calc(100vh-3rem)] ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {showToast ? (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-success bg-success-light px-3 py-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" />
              Report saved successfully
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger bg-danger-light px-3 py-2 text-sm font-medium text-danger">
              <XCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          ) : null}

          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{isEditMode ? 'Edit Lab Report' : 'Add Lab Report'}</h3>
              <p className="text-sm text-text-muted">
                {isEditMode ? 'Update the report details below' : 'Upload a new lab report for this patient'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="transition-default rounded-lg p-2 text-text-muted hover:bg-surface-tertiary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ReportForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitLabel={isEditMode ? 'Save Changes' : 'Save Report'}
            loadingLabel="Saving..."
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ReportModal
