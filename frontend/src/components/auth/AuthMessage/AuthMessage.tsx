import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

function AuthMessage({ children, tone = 'error' }: { children: string; tone?: 'error' | 'success' }) {
  const success = tone === 'success'
  return (
    <div
      aria-live="polite"
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-5 ${success ? 'border-success/20 bg-success-soft text-success' : 'border-danger/20 bg-danger-soft text-danger'}`}
      role={success ? 'status' : 'alert'}
    >
      {success ? <FiCheckCircle aria-hidden="true" className="mt-0.5 shrink-0" /> : <FiAlertCircle aria-hidden="true" className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </div>
  )
}

export default AuthMessage
