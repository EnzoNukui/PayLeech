import { useId, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  placeholder?: string
  error?: string
}

function Select({ id, label, options, placeholder, error, className = '', ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? props.name ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-ink" htmlFor={selectId}>
        {label}
      </label>
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`h-11 w-full rounded-control border bg-surface-raised px-3.5 text-sm text-ink outline-none transition hover:border-[#c9b9a8] focus:border-accent focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-surface-muted ${error ? 'border-danger' : 'border-border'} ${className}`}
        id={selectId}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs leading-5 text-danger" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
