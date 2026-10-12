import { useState } from 'react'
import Button from '../../ui/Button/Button'
import Dialog from '../../ui/Dialog/Dialog'
import type { Assinatura } from '../../../types/assinatura'

interface DeleteSubscriptionDialogProps {
  assinatura: Assinatura | null
  onOpenChange: (open: boolean) => void
  onConfirm: (assinatura: Assinatura) => Promise<void>
}

function DeleteSubscriptionDialog({ assinatura, onOpenChange, onConfirm }: DeleteSubscriptionDialogProps) {
  const [erro, setErro] = useState('')
  const [excluindo, setExcluindo] = useState(false)

  async function handleConfirm() {
    if (!assinatura) return
    setErro('')
    setErro('')
    setExcluindo(true)
    try {
      await onConfirm(assinatura)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível excluir a assinatura.')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <Dialog
      description={assinatura ? `${assinatura.nome} será removida. Essa ação não pode ser desfeita.` : undefined}
      onOpenChange={onOpenChange}
      open={Boolean(assinatura)}
      title="Excluir assinatura?"
    >
      {erro && <p className="mb-4 rounded-control bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">{erro}</p>}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={() => onOpenChange(false)} variant="quiet">Cancelar</Button>
        <Button loading={excluindo} onClick={() => void handleConfirm()} variant="danger">Excluir assinatura</Button>
      </div>
    </Dialog>
  )
}

export default DeleteSubscriptionDialog
