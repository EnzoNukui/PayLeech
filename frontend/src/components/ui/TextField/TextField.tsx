import { useId, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

function TextField({ id, label, error, hint, className = '', ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const messageId = `${inputId}-message`

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-ink" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={error || hint ? messageId : undefined}
        aria-invalid={Boolean(error)}
        className={`h-11 w-full rounded-control border bg-surface-raised px-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/75 hover:border-[#c9b9a8] focus:border-accent focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-surface-muted ${error ? 'border-danger' : 'border-border'} ${className}`}
        id={inputId}
        {...props}
      />
      {(error || hint) && (
        <p className={`mt-1.5 text-xs leading-5 ${error ? 'text-danger' : 'text-ink-muted'}`} id={messageId}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

export default TextField
