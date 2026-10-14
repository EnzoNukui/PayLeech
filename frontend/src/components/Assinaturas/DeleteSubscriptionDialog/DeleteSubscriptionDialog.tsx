import { useState } from 'react'
import Button from '../../ui/Button/Button'
import Dialog from '../../ui/Dialog/Dialog'
import type { Assinatura } from '../../../types/assinatura'

interface DeleteSubscriptionDialogProps {
  assinatura: Assinatura | null
  onOpenChange: (open: boolean) => void
  onConfirm: (assinatura: Assinatura, apagarHistorico: boolean) => Promise<void>
}

function DeleteSubscriptionDialog({ assinatura, onOpenChange, onConfirm }: DeleteSubscriptionDialogProps) {
  const [erro, setErro] = useState('')
  const [excluindo, setExcluindo] = useState(false)
  const [apagarHistorico, setApagarHistorico] = useState(false)

  function handleOpenChange(open: boolean) {
    if (!open) {
      setErro('')
      setApagarHistorico(false)
    }
    onOpenChange(open)
  }

  async function handleConfirm() {
    if (!assinatura) return
    setErro('')
    setExcluindo(true)
    try {
      await onConfirm(assinatura, apagarHistorico)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível excluir a assinatura.')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <Dialog
      description={assinatura ? `${assinatura.nome} será removida. Você pode manter ou apagar o histórico de cobranças.` : undefined}
      onOpenChange={handleOpenChange}
      open={Boolean(assinatura)}
      title="Excluir assinatura?"
    >
      {erro && <p className="mb-4 rounded-control bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">{erro}</p>}
      <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-control border border-border bg-surface-raised p-3.5 text-sm">
        <input
          checked={apagarHistorico}
          className="mt-0.5 size-4 accent-danger"
          onChange={(event) => setApagarHistorico(event.target.checked)}
          type="checkbox"
        />
        <span>
          <span className="block font-medium text-ink">Apagar também o histórico de cobranças</span>
          <span className="mt-1 block leading-5 text-ink-muted">
            Remove os valores pagos e as cobranças previstas desta assinatura dos gastos e relatórios. Essa ação não pode ser desfeita.
          </span>
        </span>
      </label>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={() => handleOpenChange(false)} variant="quiet">Cancelar</Button>
        <Button loading={excluindo} onClick={() => void handleConfirm()} variant="danger">Excluir assinatura</Button>
      </div>
    </Dialog>
  )
}

export default DeleteSubscriptionDialog
