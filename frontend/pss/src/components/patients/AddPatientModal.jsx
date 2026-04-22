import { CheckCircle2, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createPatient, updatePatient } from '../../api/patients'
import PatientForm from './PatientForm'

function AddPatientModal({ isOpen, onClose, onSuccess, patient = null }) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const isEditMode = Boolean(patient)

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

  const handleSubmit = async (payload) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      if (isEditMode) {
        await updatePatient(patient.patient_id, payload)
      } else {
        await createPatient(payload)
      }
      onSuccess()
      setShowToast(true)

      setTimeout(() => {
        setShowToast(false)
        onClose()
      }, 2000)
    } catch (error) {
      setErrorMessage(error.message || `Failed to ${isEditMode ? 'update' : 'create'} patient`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!shouldRender) return null

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/30 backdrop-blur-md"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className={`animate-scaleIn relative w-full max-w-lg rounded-2xl border border-white/50 bg-surface p-6 shadow-dropdown transition-all duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-h-[calc(100vh-3rem)] ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {showToast ? (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-success bg-success-light px-3 py-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" />
              {isEditMode ? 'Patient updated successfully' : 'Patient added successfully'}
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
              <h3 className="text-lg font-semibold text-text-primary">
                {isEditMode ? 'Edit Patient' : 'Add New Patient'}
              </h3>
              <p className="text-sm text-text-muted">
                {isEditMode ? 'Update the patient details below' : 'Fill in the patient details below'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="transition-default rounded-lg p-2 text-text-muted hover:bg-surface-tertiary hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <PatientForm
            initialValues={patient || undefined}
            submitLabel={isEditMode ? 'Save Changes' : 'Add Patient'}
            loadingLabel="Saving..."
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default AddPatientModal
