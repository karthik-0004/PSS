import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, ClipboardList, Clock, Edit2, ExternalLink, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { REPORT_TYPE_COLORS } from '../../constants'
import EmptyState from '../ui/EmptyState'
import StatusBadge from '../ui/StatusBadge'

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function resolveFileUrl(filePath) {
  if (!filePath) return ''
  const fileName = filePath.split('/').pop()
  if (!fileName) return ''
  return `http://localhost:8000/uploads/${fileName}`
}

function buildPagination(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + 4)

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  return pages
}

function GlobalReportsTable({
  reports,
  loading,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  totalCount,
  pageSize = 15,
  hasActiveFilters,
  onClearFilters,
}) {
  const navigate = useNavigate()
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1)
  const paginationItems = buildPagination(currentPage, totalPages)
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = totalCount === 0 ? 0 : Math.min(currentPage * pageSize, totalCount)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-surface-secondary">
            <tr className="border-b border-border">
              <th className="w-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Report Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Result</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Reference Range</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Document</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, rowIndex) => (
                  <tr key={`global-report-skeleton-${rowIndex}`} className="border-b border-surface-tertiary">
                    {Array.from({ length: 9 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3.5">
                        <div
                          className="animate-pulse rounded bg-surface-tertiary"
                          style={{
                            height: '14px',
                            width: `${50 + ((rowIndex + cellIndex) % 5) * 15}px`,
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : reports.map((report, index) => {
                  const rowNumber = (currentPage - 1) * pageSize + index + 1
                  const fileUrl = resolveFileUrl(report.file_path)
                  const isAbnormal = report.status === 'Abnormal'

                  return (
                    <tr
                      key={report.id}
                      className={`transition-default border-b border-surface-tertiary ${
                        isAbnormal ? 'border-l-2 border-l-danger hover:bg-red-50' : 'hover:bg-surface-secondary'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-xs text-text-muted">{rowNumber}</td>

                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/patients/${report.patient?.patient_id}`)}
                          className="text-left"
                        >
                          <p className="max-w-[180px] truncate text-sm font-medium text-text-primary transition-default hover:text-brand-600 hover:underline" title={report.patient?.name || '-'}>
                            {report.patient?.name || '-'}
                          </p>
                          <span className="inline-flex rounded-md border border-border bg-surface-tertiary px-2 py-0.5 font-mono text-xs text-text-secondary">
                            {report.patient?.patient_id || '-'}
                          </span>
                        </button>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                            REPORT_TYPE_COLORS[report.report_type] || REPORT_TYPE_COLORS.Custom
                          }`}
                        >
                          {report.report_type}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-sm text-text-secondary">
                        <p>{formatDate(report.report_date)}</p>
                        <p className="text-xs text-text-muted">{formatTime(report.created_at)}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                          <span>
                            {report.result_value} {report.unit}
                          </span>
                          {report.status === 'Abnormal' ? <AlertTriangle className="h-3.5 w-3.5 text-danger" /> : null}
                          {report.status === 'Normal' ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : null}
                          {report.status === 'Pending' ? <Clock className="h-3.5 w-3.5 text-warning" /> : null}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-sm text-text-muted">
                        {report.reference_min} - {report.reference_max} {report.unit}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={report.status} />
                      </td>

                      <td className="px-4 py-3.5">
                        {fileUrl ? (
                          <button
                            type="button"
                            onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                            className="transition-default inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View
                          </button>
                        ) : (
                          <span className="text-sm text-text-muted">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(report)}
                            className="transition-default rounded-lg p-2 text-text-secondary hover:bg-brand-50 hover:text-brand-600"
                            title="Edit report"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(report.id)}
                            className="transition-default rounded-lg p-2 text-text-secondary hover:bg-danger-light hover:text-danger"
                            title="Delete report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>

      {!loading && reports.length === 0 ? (
        <div className="p-10">
          <EmptyState
            icon={ClipboardList}
            title={hasActiveFilters ? 'No reports match your filters' : 'No reports found'}
            description={
              hasActiveFilters
                ? 'Try adjusting filter criteria to see matching reports'
                : 'Lab reports will appear here once they are uploaded for patients'
            }
            action={
              hasActiveFilters
                ? {
                    label: 'Clear all filters',
                    onClick: onClearFilters,
                  }
                : undefined
            }
          />
        </div>
      ) : null}

      {!loading && totalCount > 0 ? (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">
            Showing {startItem}-{endItem} of {totalCount} reports
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="transition-default inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {paginationItems.map((item, index) =>
              item === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-text-muted">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  className={`transition-default min-w-8 rounded-lg px-2.5 py-1.5 text-sm ${
                    item === currentPage
                      ? 'bg-brand-600 text-white'
                      : 'text-text-secondary hover:bg-brand-50 hover:text-brand-600'
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="transition-default inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default GlobalReportsTable
