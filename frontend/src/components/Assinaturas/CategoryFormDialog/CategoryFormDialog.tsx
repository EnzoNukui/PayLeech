import { useState, type FormEvent } from 'react'
import Button from '../../ui/Button/Button'
import Dialog from '../../ui/Dialog/Dialog'
import TextField from '../../ui/TextField/TextField'
import type { CategoriaPayload } from '../../../types/assinatura'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CategoriaPayload) => Promise<void>
}

function CategoryFormDialog({ open, onOpenChange, onSubmit }: CategoryFormDialogProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setNome('')
      setDescricao('')
      setErro('')
    }
    onOpenChange(nextOpen)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await onSubmit({ nome: nome.trim(), descricao: descricao.trim() || undefined })
      setNome('')
      setDescricao('')
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível criar a categoria.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog
      description="Categorias ajudam a organizar seus serviços e filtrar a lista."
      onOpenChange={handleOpenChange}
      open={open}
      title="Nova categoria"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          autoComplete="off"
          label="Nome"
          maxLength={100}
          name="nome"
          onChange={(event) => setNome(event.target.value)}
          placeholder="Ex.: Entretenimento"
          required
          value={nome}
        />
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="category-description">Descrição <span className="font-normal text-ink-muted">(opcional)</span></label>
          <textarea
            className="min-h-24 w-full resize-y rounded-control border border-border bg-surface-raised px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/75 hover:border-[#c9b9a8] focus:border-accent focus:ring-4 focus:ring-accent/10"
            id="category-description"
            maxLength={255}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Uma nota para lembrar o que entra aqui"
            value={descricao}
          />
        </div>
        {erro && <p className="rounded-control bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">{erro}</p>}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button onClick={() => handleOpenChange(false)} variant="quiet">Cancelar</Button>
          <Button loading={salvando} type="submit">Criar categoria</Button>
        </div>
      </form>
    </Dialog>
  )
}

export default CategoryFormDialog
