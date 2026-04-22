import clsx from 'clsx'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import LoadingSpinner from './LoadingSpinner'

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
  confirmDisabled = false,
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isLoading, isOpen, onClose])

  return createPortal(
    <div
      className={clsx(
        'fixed inset-0 z-50 overflow-y-auto transition-opacity duration-200',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/30 backdrop-blur-md"
        aria-label="Close dialog"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="animate-scaleIn relative w-full max-w-md rounded-2xl border border-white/50 bg-surface p-6 shadow-dropdown max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-h-[calc(100vh-3rem)]">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className="mt-2 text-sm text-text-secondary">{description}</p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="transition-default rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-tertiary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmDisabled}
              className="transition-default inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : null}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmDialog
