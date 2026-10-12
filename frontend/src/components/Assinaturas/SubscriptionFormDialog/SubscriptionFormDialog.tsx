import { useCallback, useState, type FormEvent } from 'react'
import Button from '../../ui/Button/Button'
import Dialog from '../../ui/Dialog/Dialog'
import Select, { type SelectOption } from '../../ui/Select/Select'
import TextField from '../../ui/TextField/TextField'
import ServiceCatalogSelect from '../ServiceCatalogSelect/ServiceCatalogSelect'
import ServiceIconPicker from '../ServiceIconPicker/ServiceIconPicker'
import ServicePriceSuggestion from '../ServicePriceSuggestion/ServicePriceSuggestion'
import type { ServiceSuggestion } from '../../../data/subscriptionCatalog'
import { knownServiceIcon } from '../../../data/serviceIcons'
import type { Assinatura, AssinaturaPayload, Periodicidade, StatusAssinatura } from '../../../types/assinatura'

interface SubscriptionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: SelectOption[]
  assinatura?: Assinatura | null
  onSubmit: (payload: AssinaturaPayload) => Promise<void>
}

interface FormValues {
  nome: string
  valor: string
  periodicidade: Periodicidade
  dataPrimeiraCobranca: string
  statusAssinatura: StatusAssinatura
  categoriaId: string
  icone: string
}

const periodicityOptions: SelectOption[] = [
  { value: 'MENSAL', label: 'Mensal' },
  { value: 'TRIMESTRAL', label: 'A cada 3 meses' },
  { value: 'ANUAL', label: 'Anual' },
]
const statusOptions: SelectOption[] = [
  { value: 'ATIVA', label: 'Ativa' },
  { value: 'PAUSADA', label: 'Pausada' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

function currentDateInputValue() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}

function initialValues(assinatura?: Assinatura | null): FormValues {
  return {
    nome: assinatura?.nome ?? '',
    valor: assinatura ? String(assinatura.valor) : '',
    periodicidade: assinatura?.periodicidade ?? 'MENSAL',
    dataPrimeiraCobranca: assinatura?.dataPrimeiraCobranca ?? currentDateInputValue(),
    statusAssinatura: assinatura?.statusAssinatura ?? 'ATIVA',
    categoriaId: assinatura ? String(assinatura.categoria.id) : '',
    icone: assinatura?.icone ?? '',
  }
}

function SubscriptionFormDialog({ open, onOpenChange, categories, assinatura, onSubmit }: SubscriptionFormDialogProps) {
  const [values, setValues] = useState(() => initialValues(assinatura))
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await onSubmit({
        nome: values.nome.trim(),
        valor: Number(values.valor),
        periodicidade: values.periodicidade,
        dataPrimeiraCobranca: values.dataPrimeiraCobranca,
        statusAssinatura: values.statusAssinatura,
        categoriaId: Number(values.categoriaId),
        icone: values.icone || null,
      })
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar a assinatura.')
    } finally {
      setSalvando(false)
    }
  }

  function updateValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const applySuggestedPrice = useCallback((valor: string) => {
    setValues((current) => ({ ...current, valor }))
  }, [])

  function applyServiceSuggestion(service: ServiceSuggestion) {
    const matchingCategory = categories.find((category) => category.label.localeCompare(service.categoria, 'pt-BR', { sensitivity: 'base' }) === 0)
    setValues((current) => ({
      ...current,
      nome: service.nome,
      icone: knownServiceIcon(service.nome),
      ...(matchingCategory ? { categoriaId: matchingCategory.value } : {}),
    }))
  }

  return (
    <Dialog
      description="Organize os detalhes e a frequência dessa cobrança."
      onOpenChange={onOpenChange}
      open={open}
      title={assinatura ? 'Editar assinatura' : 'Nova assinatura'}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {!assinatura && <ServiceCatalogSelect onCustom={() => document.getElementById('nome')?.focus()} onSelect={applyServiceSuggestion} />}
        <TextField
          autoComplete="off"
          id="nome"
          label="Nome do serviço"
          maxLength={100}
          name="nome"
          onChange={(event) => updateValue('nome', event.target.value)}
          placeholder="Digite qualquer serviço, mesmo que não apareça nas sugestões"
          required
          value={values.nome}
        />
        <ServiceIconPicker onChange={(icone) => updateValue('icone', icone)} serviceName={values.nome} value={values.icone} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Valor"
            min="0.01"
            name="valor"
            onChange={(event) => updateValue('valor', event.target.value)}
            placeholder="0,00"
            required
            step="0.01"
            type="number"
            value={values.valor}
          />
          <Select
            label="Periodicidade"
            name="periodicidade"
            onChange={(event) => updateValue('periodicidade', event.target.value as Periodicidade)}
            options={periodicityOptions}
            value={values.periodicidade}
          />
        </div>
        <ServicePriceSuggestion onUsePrice={applySuggestedPrice} periodicidade={values.periodicidade} serviceName={values.nome} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Primeira cobrança"
            name="dataPrimeiraCobranca"
            onChange={(event) => updateValue('dataPrimeiraCobranca', event.target.value)}
            required
            type="date"
            value={values.dataPrimeiraCobranca}
          />
          <Select
            label="Status"
            name="statusAssinatura"
            onChange={(event) => updateValue('statusAssinatura', event.target.value as StatusAssinatura)}
            options={statusOptions}
            value={values.statusAssinatura}
          />
        </div>
        <Select
          label="Categoria"
          name="categoriaId"
          onChange={(event) => updateValue('categoriaId', event.target.value)}
          options={categories}
          placeholder="Selecione uma categoria"
          required
          value={values.categoriaId}
        />

        {erro && <p className="rounded-control bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">{erro}</p>}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button onClick={() => onOpenChange(false)} variant="quiet">Cancelar</Button>
          <Button loading={salvando} type="submit">{assinatura ? 'Salvar alterações' : 'Criar assinatura'}</Button>
        </div>
      </form>
    </Dialog>
  )
}

export default SubscriptionFormDialog
