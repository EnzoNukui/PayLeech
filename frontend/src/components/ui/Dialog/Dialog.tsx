import { FiX } from 'react-icons/fi'
import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

function Dialog({ open, onOpenChange, title, description, children, className = '' }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    const dialog = event.currentTarget
    const bounds = dialog.getBoundingClientRect()
    const clickedOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom

    if (clickedOutside) onOpenChange(false)
  }

  return (
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-panel border border-border bg-surface p-0 text-ink shadow-xl backdrop:bg-ink/35 backdrop:backdrop-blur-[2px] ${className}`}
      onCancel={(event) => {
        event.preventDefault()
        onOpenChange(false)
      }}
      onClick={closeFromBackdrop}
      onClose={() => onOpenChange(false)}
      ref={dialogRef}
    >
      <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" id={titleId}>
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm leading-5 text-ink-muted" id={descriptionId}>
              {description}
            </p>
          )}
        </div>
        <button
          aria-label="Fechar janela"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-muted transition hover:bg-surface-muted hover:text-ink"
          onClick={() => onOpenChange(false)}
          type="button"
        >
          <FiX aria-hidden="true" size={18} />
        </button>
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </dialog>
  )
}

export default Dialog
