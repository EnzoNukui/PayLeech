import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import TextField from '../../ui/TextField/TextField'

interface PasswordFieldProps {
  label: string
  name: string
  autoComplete: string
  placeholder?: string
  error?: string
  hint?: string
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
}

function PasswordField({ label, name, autoComplete, placeholder, error, hint, value, onChange, onFocus }: PasswordFieldProps) {
  const [visivel, setVisivel] = useState(false)
  return (
    <div className="relative">
      <TextField
        autoComplete={autoComplete}
        className="pr-12"
        error={error}
        hint={hint}
        label={label}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        type={visivel ? 'text' : 'password'}
        value={value}
      />
      <button
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute right-3 top-[2.45rem] grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        onClick={() => setVisivel((atual) => !atual)}
        type="button"
      >
        {visivel ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
      </button>
    </div>
  )
}

export default PasswordField
